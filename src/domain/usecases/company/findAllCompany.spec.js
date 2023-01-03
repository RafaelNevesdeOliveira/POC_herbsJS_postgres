const Company = require('../../entities/company')
const findAllCompany = require('./findAllCompany')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllCompanySpec = spec({

    usecase: findAllCompany,
  
    'Find all companys': scenario({
      'Given an existing company': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            CompanyRepository: class CompanyRepository {
              async findAll(id) { 
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

      'Must return a list of companys': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllCompanySpec, 'FindAllCompanySpec')
    .metadata({ usecase: 'FindAllCompany' })
    .spec