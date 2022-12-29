import IProfileCloudServer from '@/interfaces/IProfileCloudServer'
import { Form, Input } from 'antd'

const ProfileCloudServer = ({
    data,
    onchangePass,
    onchangePort,
    onchangeName,
}: {
    data: IProfileCloudServer
    onchangePass: (datas: IProfileCloudServer, values: string) => void
    onchangePort: (datas: IProfileCloudServer, values: string) => void
    onchangeName: (datas: IProfileCloudServer, values: string) => void
}) => {
    const [form] = Form.useForm()
    form.setFieldsValue({
        password: data.password,
        port: data.port,
        cloudServerName: data.cloudServerName,
    })

    return (
        <>
            <Form
                form={form}
                name="horizontal_login"
                layout="inline"
                style={{ paddingBottom: 12 }}
            >
                <Form.Item name="password">
                    <Input
                        name="password"
                        style={{ borderRadius: 5 }}
                        className="border-radius"
                        placeholder="Nhập mật khẩu"
                        onChange={(e) => onchangePass(data, e.target.value)}
                    />
                </Form.Item>
                {/* <Form.Item name="port">
                    <Input
                        name="port"
                        style={{ borderRadius: 5 }}
                        placeholder="Chọn port từ 1024->65535"
                        onChange={(e) => onchangePort(data, e.target.value)}
                    />
                </Form.Item>*/}
                <Form.Item name="cloudServerName">
                    <Input
                        name="cloudServerName"
                        style={{ borderRadius: 5 }}
                        placeholder="Nhập nhãn dịch vụ mà bạn muốn"
                        onChange={(e) => onchangeName(data, e.target.value)}
                    />
                </Form.Item> 
            </Form>
        </>
    )
}

export default ProfileCloudServer
