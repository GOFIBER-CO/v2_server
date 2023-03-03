import IArea from './IArea'
import Ip from './IIps'
import IOperatingSystem from './IOperatingSystem'
import IOrder from './IOrder'
import IService from './IService'

export default interface ICloudServer {
   bandwidth: {
    data_recieve: number,
    data_send: number,
   },
   built: boolean,
   cpus: 4,
   createdAt: Date,
   disk: number,
   ha: boolean,
   id: string,
   ip: {
    gateway: string,
    id: number,
    interface: number,
    ip: string,
    mac: string,
    main: number,
    network:string,
    options: {
        private: boolean,
        keep_mac: boolean
    },
    server_id: number,
    type: string,
    vmid: number,
    wanip: string
   },
   ipv4: string,
   ipv6: string | null,
   label: string,
   list_id: number,
   locked: boolean,
   memory: number,
   power: boolean,
   replication: boolean,
   service_id: number,
   sshkeys: string[],
   status: string,
   status_lang: string,
   swap: number,
   template_data: string[],
   template_id: string,
   template_name: string,
   updatedAt: Date,
   uptime: number,
   username: boolean

}
