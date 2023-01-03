const createCompany = require('./createCompany')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createCompanySpec = spec({

    usecase: createCompany,
  
    'Create a new company when it is valid': scenario({
      'Given a valid company': given({
        request: {
            name: 'a text'
        },
        user: { hasAccess: true },
        injection: {
            CompanyRepository: class CompanyRepository {
              async insert(company) { return (company) }
            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid company': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a company
      })

    }),

    'Do not create a new company when it is invalid': scenario({
      'Given a invalid company': given({
        request: {
          name: true
        },
        user: { hasAccess: true },
        injection: {
            companyRepository: new ( class CompanyRepository {
              async insert(company) { return (company) }
            })
        },
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ret.isInvalidEntityError)
      }),

    }),
  })
  
module.exports =
  herbarium.specs
    .add(createCompanySpec, 'CreateCompanySpec')
    .metadata({ usecase: 'CreateCompany' })
    .spec