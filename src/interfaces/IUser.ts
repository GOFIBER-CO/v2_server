export interface IRole {
  id?: string;
  code: string;
  roleName: string;
  createdAt: Date;
  updateAt: Date;
}

export interface IUser {
    _id: string,
    id: string,
    object_id: number;
    email: string;
    password: string;
    lastLogin: string;
    ip: string;
    host: string;
    status: string;
    parent_id: string;
    firstname: string;
    lastname: string;
    companyName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    code: string;
    country: string;
    phonenumber: string;
    datecreated: string;
    notes: string;
    language: string;
    company: number;
    credit: number;
    taxexempt: number;
    latefeeoveride: number;
    cardtype: string;
    cardnum: string;
    expdate: string;
    overideduenotices: number;
    client_id: string;
    currency_id: number;
    countryname: string;
    access: any[];
    achrouting: string;
    achaccount: string;
    achtype: string;
    assigned_affiliate: boolean;
    cardcreated: string;
    cardupdated: string;
    group_id: string;
    loginattempts: number;
    mfamodule: number;
    taxrate: number;
    disableemails: number;
    affiliate_id: string;
    billing_contact_id: string;
    group_name: string;
    group_color: string;
    accesstoken: string;
    refreshtoken: string;
    role?: string | IRole
  }
  