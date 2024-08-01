declare module '@adonisjs/core/http' {
  interface HttpContext<TBody = any> {
    body: TBody
  }
}
