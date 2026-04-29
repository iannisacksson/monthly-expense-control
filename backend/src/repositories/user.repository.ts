import { User } from "../models/index"

const PUBLIC_ATTRIBUTES = ["id", "name", "email", "created_at", "updated_at"]

export class UserRepository {
  async create(data: { name: string; email: string; password_hash: string }) {
    return User.create(data)
  }

  async findById(id: string) {
    return User.findByPk(id, { attributes: PUBLIC_ATTRIBUTES })
  }

  async findByIdWithHash(id: string) {
    return User.findByPk(id)
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } })
  }

  async findAll() {
    return User.findAll({ attributes: PUBLIC_ATTRIBUTES })
  }

  async update(id: string, data: Partial<{ name: string; email: string; password_hash: string }>) {
    const user = await User.findByPk(id)
    if (!user) return null
    await user.update(data)
    return User.findByPk(id, { attributes: PUBLIC_ATTRIBUTES })
  }

  async delete(id: string) {
    const user = await User.findByPk(id)
    if (!user) return null
    await user.destroy()
    return true
  }
}
