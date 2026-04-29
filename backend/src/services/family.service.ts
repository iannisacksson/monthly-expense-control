import { FamilyRepository } from "../repositories/family.repository"
import { CreateFamilyDTO, UpdateFamilyDTO } from "../dtos/family.dto"

const familyRepository = new FamilyRepository()

export class FamilyService {
  async createFamily(data: CreateFamilyDTO) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new Error("Family name must be between 2 and 100 characters")
    }

    return familyRepository.create(data)
  }

  async findFamilyById(id: string) {
    const family = await familyRepository.findById(id)
    if (!family) {
      throw new Error("Family not found")
    }
    return family
  }

  async listFamilies() {
    return familyRepository.findAll()
  }

  async updateFamily(id: string, data: UpdateFamilyDTO) {
    if (data.name !== undefined && (data.name.length < 2 || data.name.length > 100)) {
      throw new Error("Family name must be between 2 and 100 characters")
    }

    const family = await familyRepository.update(id, data)
    if (!family) {
      throw new Error("Family not found")
    }
    return family
  }

  async deleteFamily(id: string) {
    const family = await familyRepository.delete(id)
    if (!family) {
      throw new Error("Family not found")
    }
    return family
  }
}
