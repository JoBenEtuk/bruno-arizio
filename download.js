require('dotenv').config()

const fs = require('fs')

const prismic = require('@prismicio/client')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const accessToken = process.env.PRISMIC_ACCESS_TOKEN
const endpoint = prismic.getRepositoryEndpoint(process.env.PRISMIC_REPOSITORY)
const client = prismic.createClient(endpoint, {
  accessToken,
  fetch,
})

client.dangerouslyGetAll().then((results) => {
  fs.writeFile('content.json', JSON.stringify(results, null, 4), 'utf8', () => {
    console.log('Content generated under content.json.')
  })
})
