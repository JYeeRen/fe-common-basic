import { Button, Col, DataGrid, Form, Input, Row, Select } from "@components";

function AccountList() {
  return (
    <>
      <Form>
        <Row>
          <Col span={19}>
            <Row gutter={24}>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="select">
                  <Select>
                    <Select.Option value="a">a</Select.Option>
                    <Select.Option value="b">b</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={12} md={8}>
                <Form.Item label="input">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col offset={1} span={4}>
            <Button>confirm</Button>
            <Button>reset</Button>
          </Col>
        </Row>
      </Form>
      <DataGrid />
    </>
  );
}

export default AccountList;
