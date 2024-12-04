import config from '@application/config';
import { CustomError } from '@application/error';
import { StatusCode } from '@application/utilities';
import { Contact } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';
import { Op, OrderItem, QueryTypes } from 'sequelize';
import { PaginationResponse } from '.';

export interface IContactRepository {
    readonly db: IDatabase;
    saveContact(contact: Contact): Promise<void>;
    getContactById(contactId: string): Promise<Contact>;
    deleteContact(contactId: string): Promise<void>;
    getContactByName(name: string): Promise<Contact>;
    getContacts(
        filters: ContactFilters,
    ): Promise<PaginationResponse<Contact, 'contacts'>>;
    updateContact(contact: Contact): Promise<void>;
}

type ContactSort = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export interface ContactFilters {
    search?: string;
    clientId?: string;
    responsibleUserId?: string;
    pageLimit?: number;
    pageNumber?: number;
    sort?: ContactSort;
}

export class ContactRepository implements IContactRepository {
    constructor(readonly db: IDatabase) {}

    async saveContact(contact: Contact): Promise<void> {
        await this.db.contact.create({ ...contact });
    }

    async getContactById(contactId: string): Promise<Contact> {
        const contact = await this.db.contact.findOne({
            where: { contactId },
            include: [
                { model: this.db.user, as: 'responsibleUser' },
                { model: this.db.client },
            ],
        });
        return contact?.dataValues as Contact;
    }

    async deleteContact(contactId: string): Promise<void> {
        try {
            await this.db.contact.destroy({
                where: { contactId },
            });
        } catch (error) {
            const message = (error as Error).message;
            const list = message.split(':');
            if (list[0] === 'Cannot delete or update a parent row') {
                throw new CustomError(
                    'Migrate or delete all products under the Contact to delete',
                    StatusCode.BAD_REQUEST,
                );
            }
            throw error;
        }
    }

    async getContactByName(name: string): Promise<Contact> {
        const contact = await this.db.contact.findOne({ where: { name } });
        return contact?.dataValues as Contact;
    }

    async getContacts(
        filters: ContactFilters,
    ): Promise<PaginationResponse<Contact, 'contacts'>> {
        const {
            sort,
            responsibleUserId,
            clientId,
            search,
            pageLimit,
            pageNumber,
        } = filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        let sorting: OrderItem = ['name', 'ASC'];
        if (sort === 'name-desc') {
            sorting = ['name', 'DESC'];
        } else if (sort === 'name-asc') {
            sorting = ['name', 'ASC'];
        }

        const contacts = await this.db.contact.findAll({
            where: {
                ...(search && {
                    email: { [Op.like]: search },
                    name: { [Op.like]: search },
                }),

                ...(responsibleUserId && { responsibleUserId }),
                ...(clientId && { clientId }),
            },
            order: [sorting],
            limit,
            offset,
        });
        const totalData = await this.db.invite.count({
            where: {
                ...(search && {
                    email: { [Op.like]: search },
                    name: { [Op.like]: search },
                }),
            },
        });

        const totalPages = Math.ceil(totalData / limit);
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        return {
            contacts: contacts as Contact[],
            totalPages,
            page,
            prevPage,
            nextPage,
            limit,
            returnedData: contacts.length,
            totalData,
        };
    }

    async updateContact(contact: Contact): Promise<void> {
        await this.db.contact.update(
            { ...contact },
            { where: { contactId: contact.contactId } },
        );
    }
}
