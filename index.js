require('dotenv').config()

const express = require('express')
const path = require('path')

const filter = require('lodash/filter')
const find = require('lodash/find')
const map = require('lodash/map')

const PrismicDOM = require('prismic-dom')
const UAParser = require('ua-parser-js')

const app = express()

app.set('port', 8080)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

app.locals.PrismicDOM = PrismicDOM

const results = require('./content.json')

const get = (results, request) => {
  const analytics = process.env.GOOGLE_ANALYTICS

  const ua = UAParser(request.headers['user-agent'])

  const functionals = find(results, { type: 'functionals' })
  const meta = find(results, { type: 'meta' })
  const navigation = find(results, { type: 'navigation' })
  const sharing = find(results, { type: 'sharing' })
  const social = find(results, { type: 'social' })

  const isDesktop = ua.device.type === undefined
  const isPhone = ua.device.type === 'mobile'
  const isTablet = ua.device.type === 'tablet'

  const projectsList = filter(results, { type: 'project' })
  const {
    data: { list: projectsOrder },
  } = find(results, { type: 'ordering' })

  const projects = map(projectsOrder, ({ project: { uid } }) => {
    return find(projectsList, { uid })
  })

  return {
    analytics,
    functionals,
    isDesktop,
    isPhone,
    isTablet,
    meta,
    navigation,
    projects,
    sharing,
    social,
  }
}

app.get('/', (request, response) => {
  const home = find(results, { type: 'home' })

  const standard = get(results, request)

  response.render('pages/home', { home, ...standard })
})

app.get('/index', (request, response) => {
  const index = find(results, { type: 'index' })

  const standard = get(results, request)

  if (standard.isPhone) {
    response.redirect('/')
  } else {
    response.render('pages/index', { index, ...standard })
  }
})

app.get('/about', (request, response) => {
  const about = find(results, { type: 'about' })

  const standard = get(results, request)

  response.render('pages/about', { about, ...standard })
})

app.get('/essays', (request, response) => {
  const about = find(results, { type: 'about' })
  const essays = find(results, { type: 'essays' })

  const standard = get(results, request)

  response.render('pages/essays', { about, essays, ...standard })
})

app.get('/case/:id', (request, response) => {
  const standard = get(results, request)

  const { projects } = standard

  const cases = find(results, { type: 'projects' })
  const project = find(projects, { uid: request.params.id })
  const projectIndex = projects.indexOf(project)
  const related = projects[projectIndex + 1] ? projects[projectIndex + 1] : projects[0]

  response.render('pages/case', { ...standard, cases, project, projectIndex, related })
})

app.use((request, response) => {
  response.status(404)

  if (request.accepts('html')) {
    response.redirect('/')

    return
  }

  if (request.accepts('json')) {
    response.send({ error: 'Not Found' })

    return
  }

  response.type('txt').send('Not Found')
})

app.listen(app.get('port'))
