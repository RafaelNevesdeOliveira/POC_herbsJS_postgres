const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Company = require('../../entities/company')
const CompanyRepository = require('../../../infra/data/repositories/companyRepository')

const dependency = { CompanyRepository }

const updateCompany = injection =>
  usecase('Update Company', {
    // Input/Request metadata and validation 
    request: request.from(Company),

    // Output/Response metadata
    response: Company,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateCompany ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Company': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.CompanyRepository(injection)
      const [company] = await repo.findByID(id)
      ctx.company = company
      if (company === undefined) return Err.notFound({
        message: `Company not found - ID: ${id}`,
        payload: { entity: 'Company' }
      })

      return Ok(company)
    }),

    'Check if it is a valid Company before update': step(ctx => {
      const oldCompany = ctx.company
      const newCompany = Company.fromJSON(merge.all([ oldCompany, ctx.req ]))
      ctx.company = newCompany

      return newCompany.isValid() ? Ok() : Err.invalidEntity({
        message: `Company is invalid`,
        payload: { entity: 'Company' },
        cause: newCompany.errors
      })

    }),

    'Update the Company': step(async ctx => {
      const repo = new ctx.di.CompanyRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.company))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateCompany, 'UpdateCompany')
    .metadata({ group: 'Company', operation: herbarium.crud.update, entity: Company })
    .usecase