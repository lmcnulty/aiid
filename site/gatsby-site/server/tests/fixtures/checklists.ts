import { ObjectId } from 'bson';
import { Fixture } from "../utils";
import { Checklist, ChecklistInsertType, ChecklistUpdateType } from "../../generated/graphql";

const checklist1 = {
  _id: new ObjectId("6537e59e9208f3f75b2db1f7"),
  owner_id: "63601cdc29e6840df23ad3e5",
  tags_methods: [ "GMF:Known AI Technology:Language Modeling" ],
  tags_goals: [ "GMF:Known AI Goal:Chatbot" ],
  about: "",
  risks: [
    {
      id: "09511dbb-6bd8-42de-bc7b-bbac8864455b",
      tags: [
        "GMF:Known AI Technical Failure:Unsafe Exposure or Access"
      ],
      severity: "",
      title: "Unsafe Exposure or Access",
      generated: false,
      risk_status: "Not Mitigated",
      likelihood: "",
      touched: false,
      risk_notes: ""
    }
  ],
  tags_other: [ "CSETv1:Entertainment Industry:yes" ],
  id: "849bd303-261f-4abe-8746-77dad5841dbe",
  name: "Test Checklist"
}

const subscriber = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e6'),
    first_name: 'Subscriber',
    last_name: 'One',
    roles: ['subscriber'],
    userId: 'subscriber1',
}

const admin = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e5'),
    first_name: 'Super',
    last_name: 'Man',
    roles: ['admin'],
    userId: 'admin',
}

const anonymous = {
    _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e9'),
    first_name: 'Anon',
    last_name: 'Anon',
    roles: [],
    userId: 'anon',
}

const fixture: Fixture<ChecklistType, ChecklistUpdateType, ChecklistInsertType> = {
    name: 'checklists',
    query: `
        _id
        owner_id
        tags_methods
        tags_goals
        about
        risks
        tags_other
        id
        name
    `,
    seeds: {
        customData: {
            users: [
                subscriber,
                admin,
                anonymous,
            ],
        },
        aiidprod: {
            checklists: [checklist1]
        }
    },
}

export default fixture;
