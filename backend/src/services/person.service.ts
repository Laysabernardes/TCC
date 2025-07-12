import { z } from 'zod';
import { PersonModel } from '../models/person.model';
import { PersonResponseType } from '../dtos/person.dto';
import { createPersonSchema, updatePersonSchema } from '../zod/schemas/person.schema';

type CreatePersonInput = z.infer<typeof createPersonSchema>['body'];
type UpdatePersonInput = z.infer<typeof updatePersonSchema>['body'];

export class PersonService {
  static async create(input: CreatePersonInput): Promise<PersonResponseType> {
    const person = await PersonModel.create(input);
    return person.toObject() as PersonResponseType;
  }

  static async findAll(kind?: string): Promise<PersonResponseType[]> {
    const filter = kind ? { kind: kind } : {};
    const people = await PersonModel.find(filter).lean();
    return people.map(p => ({ ...p, _id: p._id.toString() })) as PersonResponseType[];
  }

  static async findById(id: string): Promise<PersonResponseType | null> {
    const person = await PersonModel.findById(id).lean();
    if (!person) return null;
    return { ...person, _id: person._id.toString() } as PersonResponseType;
  }

  static async update(id: string, input: UpdatePersonInput): Promise<PersonResponseType | null> {
    const person = await PersonModel.findByIdAndUpdate(id, input, { new: true }).lean();
    if (!person) return null;
    return { ...person, _id: person._id.toString() } as PersonResponseType;
  }

  static async delete(id: string): Promise<void> {
    const result = await PersonModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Pessoa não encontrada para deletar.");
    }
  }
}