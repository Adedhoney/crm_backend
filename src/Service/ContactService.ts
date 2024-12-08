import { ContactDTO } from '@api/DTO';
import { CustomError } from '@application/error';
import {
    generateRandomId,
    getCurrentTimeStamp,
    StatusCode,
} from '@application/utilities';
import { ActivityTypes, Contact, User } from '@domain/Models';
import {
    ContactFilters,
    IClientRepository,
    IContactRepository,
    PaginationResponse,
} from '@domain/Repositories';
import { IActivityRepository } from '@domain/Repositories/ActivityRepository';

export interface IContactService {
    CreateContact(data: ContactDTO, auth: User): Promise<void>;
    GetContact(contactId: string): Promise<Contact>;
    GetContacts(
        filters: ContactFilters,
    ): Promise<Promise<PaginationResponse<Contact, 'contacts'>>>;
    DeleteContact(contactId: string, auth: User): Promise<void>;
    UpdateContact(
        contactId: string,
        data: ContactDTO,
        auth: User,
    ): Promise<void>;
}

export class ContactService implements IContactService {
    constructor(
        private contactrepo: IContactRepository,
        private clientrepo: IClientRepository,
        private activityrepo: IActivityRepository,
    ) {}

    async CreateContact(data: ContactDTO, auth: User): Promise<void> {
        if (data.clientId) {
            const client = await this.clientrepo.getClientById(data.clientId);
            if (!client) {
                throw new CustomError(
                    `Client with clientId: ${data.clientId} not found`,
                );
            }
        }
        const contactId = generateRandomId();

        const date = getCurrentTimeStamp();

        const contact = {
            contactId,
            clientId: data.clientId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            title: data.title,
            responsibleUserId: data.responsibleUserId || auth.userId,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: auth.userId,
            modifiedBy: auth.userId,
        };
        await this.contactrepo.saveContact(contact);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CONTACT,
            description: `New Contact of contactId ${contactId} created by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetContact(contactId: string): Promise<Contact> {
        const Contact = await this.contactrepo.getContactById(contactId);
        return Contact;
    }
    async DeleteContact(contactId: string, auth: User): Promise<void> {
        await this.contactrepo.deleteContact(contactId);

        const date = getCurrentTimeStamp();

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CONTACT,
            description: `Contact of contactId ${contactId} deleted by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
    async GetContacts(
        filters: ContactFilters,
    ): Promise<Promise<PaginationResponse<Contact, 'contacts'>>> {
        const contact = await this.contactrepo.getContacts(filters);
        return contact;
    }
    async UpdateContact(
        contactId: string,
        data: ContactDTO,
        auth: User,
    ): Promise<void> {
        const contact = await this.contactrepo.getContactById(contactId);
        if (!contact) {
            throw new CustomError('Contact not found', StatusCode.NOT_FOUND);
        }

        const date = getCurrentTimeStamp();

        const newContact = {
            contactId,
            clientId: data.clientId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            title: data.title,
            responsibleUserId: data.responsibleUserId,
            createdOn: contact.createdOn,
            lastModifiedOn: date,
            createdBy: contact.createdBy,
            modifiedBy: auth.userId,
        };
        await this.contactrepo.updateContact(newContact);

        // save activity
        this.activityrepo.saveActivityLog({
            userId: auth.userId,
            activity: ActivityTypes.CONTACT,
            description: `Contact of contactId ${contactId} updated by User: ${auth.firstName}  ${auth.lastName}`,
            createdOn: date,
        });
    }
}
