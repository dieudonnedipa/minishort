import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'urls'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('original_url', 2000).notNullable()
      table.string('short_code', 50).unique().notNullable()
      table.integer('clicks').defaultTo(0)
      table.text('qr_code')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
