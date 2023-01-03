const Company = require('../../entities/company')
const updateCompany = require('./updateCompany')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateCompanySpec = spec({

    usecase: updateCompany,
    'Update a existing company when it is valid': scenario({

      'Valid companys': samples([
        {
          id: 'a text',
        name: 'a text'
        },
        {
          id: 'a text',
        name: 'a text'
        }
      ]),
      
      'Valid companys': samples([
        {
          id: 'a text',
        name: 'a text'
        },
        {
          id: 'a text',
        name: 'a text'
        }
      ]),

      'Given a valid company': given((ctx) => ({
        request: ctx.sample,
        user: { hasAccess: true }
      })),

      'Given a repository with a existing company': given((ctx) => ({
        injection: {
            CompanyRepository: class CompanyRepository {
              async findByID(id) { 
                const fakeCompany = {
                    id: 'a text',
        name: 'a text'
                }
                return ([Company.fromJSON(fakeCompany)])              }
              async update(id) { return true }
            }
          },
      })),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm update': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not update a company when it is invalid': scenario({
      'Given a invalid company': given({
        request: {
          id: true,
        name: true
        },
        user: { hasAccess: true },
        injection: {},
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ctx.response.isInvalidEntityError)
      }),

    }),

    'Do not update company if it does not exist': scenario({
        'Given an empty company repository': given({
          request: {
              id: 'a text',
        name: 'a text'
          },
          user: { hasAccess: true },
          injection:{
            CompanyRepository: class CompanyRepository {
              async findByID(id) { return [] }
            }
          },
        }),
  
        // when: default when for use case
  
        'Must return an error': check((ctx) => {
          assert.ok(ctx.response.isErr)
          assert.ok(ctx.response.isNotFoundError)  
        }),
      }),
  })
  
module.exports =
  herbarium.specs
    .add(updateCompanySpec, 'UpdateCompanySpec')
    .metadata({ usecase: 'UpdateCompany' })
    .spec