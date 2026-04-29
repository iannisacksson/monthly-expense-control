import { Family } from "../models/index"

export class FamilyRepository {
  async create(data: { name: string }) {
    return Family.create(data)
  }

  async findById(id: string) {
    return Family.findByPk(id)
  }

  async findAll() {
    return Family.findAll()
  }

  async update(id: string, data: Partial<{ name: string }>) {
    const family = await Family.findByPk(id)
    if (!family) return null
    return family.update(data)
  }

  async delete(id: string) {
    const family = await Family.findByPk(id)
    if (!family) return null
    await family.destroy()
    return family
  }
}
