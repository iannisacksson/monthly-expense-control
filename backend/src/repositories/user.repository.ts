import { User } from "../models/index"

export class UserRepository {
  async create(data: { name: string; email: string; password_hash: string }) {
    return User.create(data)
  }

  async findById(id: string) {
    return User.findByPk(id)
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } })
  }

  async findAll() {
    return User.findAll()
  }

  async update(id: string, data: Partial<{ name: string; email: string; password_hash: string }>) {
    const user = await User.findByPk(id)
    if (!user) return null
    return user.update(data)
  }

  async delete(id: string) {
    const user = await User.findByPk(id)
    if (!user) return null
    await user.destroy()
    return user
  }
}
