const Company = require('../../entities/company')
const findCompany = require('./findCompany')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findCompanySpec = spec({

    usecase: findCompany,
  
    'Find a company when it exists': scenario({
      'Given an existing company': given({
        request: {
            id: 'a text'
        },
        user: { hasAccess: true },
        injection: {
            CompanyRepository: class CompanyRepository {
              async findByID(id) { 
                  const fakeCompany = {
                    id: 'a text',
        name: 'a text'
                  }
                  return ([Company.fromJSON(fakeCompany)])
              }
            }
          },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid company': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
      })

    }),

    'Do not find a company when it does not exist': scenario({
        'Given an empty company repository': given({
            request: {
                id: 'a text'
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
    .add(findCompanySpec, 'FindCompanySpec')
    .metadata({ usecase: 'FindCompany' })
    .usecase