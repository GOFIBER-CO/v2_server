export default interface ITicket {
    email: string;
    _doc :{
        id?: string,
        attachments: [];
        body: string,
        client_read: number;
        createdAt: string;
        date: string;
        dept_id: number;
        deptname: string;
        file: string;
        level: number;
        status:string;
        subject: string;
        ticket_number: number;
        updatedAt: string;
        userId: string;
        _id: string
    }
}
