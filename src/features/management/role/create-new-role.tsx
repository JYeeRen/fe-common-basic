import { net } from "@infra";
import {
  Form,
  Input,
  Switch,
  Checkbox,
  Card,
  Button,
  Space,
} from "@components";
import { observer } from "mobx-react-lite";

function CreateNewRole() {
  const [form] = Form.useForm();

  const onFinish = async (values: unknown) => {
    console.log(values);
    try {
      await net.post('/api/role/createRole', values);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="角色状态" name="active">
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
        <Form.Item label="权限设置">
          <Card
            title={
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const permissions = form.getFieldValue("permissions") || [];
                  return (
                    <Checkbox
                      indeterminate={permissions.length > 0 && permissions.length < 3}
                      checked={permissions.length === 3}
                      onChange={(e) => {
                        if (e.target.checked) {
                          form.setFieldValue("permissions", ["A1", "B1", "C1"]);
                        } else {
                          form.setFieldValue("permissions", []);
                        }
                      }}
                    >
                      关务单证
                    </Checkbox>
                  );
                }}
              </Form.Item>
            }
          >
            <Form.Item name="permissions">
              <Checkbox.Group
                options={[
                  { label: "A1", value: "A1" },
                  { label: "B1", value: "B1" },
                  { label: "C1", value: "C1" },
                ]}
              />
            </Form.Item>
          </Card>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export const CreateNewRoleComponent = observer(CreateNewRole);
