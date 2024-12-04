import config from '@application/config';
import { ActivityLog, ActivityTypes } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';
import { FindOptions, Op, OrderItem } from 'sequelize';

interface ActivityFilters {
    activity?: ActivityTypes;
    creator?: string;
    creatorType?: CreatorType;
    pageLimit?: number;
    pageNumber?: number;
    sort?: activitySort;
}

type CreatorType = 'user' | 'admin';
type activitySort = 'date-desc' | 'date-asc';

export interface IActivityRepository {
    readonly db: IDatabase;
    saveActivityLog(activityLog: ActivityLog): Promise<void>;
    getActivities(filters: ActivityFilters): Promise<ActivityLog[]>;
}

export class ActivityRepository implements IActivityRepository {
    constructor(readonly db: IDatabase) {}

    async saveActivityLog(activityLog: ActivityLog): Promise<void> {
        await this.db.activityLog.create({ ...activityLog });
    }

    async getActivities(filters: ActivityFilters): Promise<ActivityLog[]> {
        const { activity, sort, pageLimit, creator, creatorType, pageNumber } =
            filters;

        const limit = Number(pageLimit)
            ? Number(pageLimit)
            : config.QUERY_LIMIT;
        const page = Number(pageNumber) ? Number(pageNumber) : 1;
        const offset = (page - 1) * limit;

        let sorting: OrderItem = ['createdOn', 'ASC'];
        if (sort === 'date-desc') {
            sorting = ['createdOn', 'DESC'];
        }

        const findOptions: FindOptions<ActivityLog> = {
            where: {
                ...(activity && { activity }),
                ...(creator && { creator }),
                ...(creatorType && {
                    creator: { [Op.startsWith]: creatorType },
                }),
            },
            order: [sorting],
            limit,
            offset,
        };

        const activities = await this.db.activityLog.findAll(findOptions);
        return activities;
    }
}
