export default interface ICommandOptions {
  name: string
  description: string
  dm_permission: boolean
  default_member_permissions: bigint
  options: Object
}
