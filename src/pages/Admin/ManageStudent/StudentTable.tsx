import { Table, TableColumnsType, Tag } from 'antd';
import React from 'react';
import DeleteStudent from './DeleteStudent';
import EditStudent from './EditStudent';



interface Student {
  id: number;
  fullName?: string;
  gender?: boolean;
  address?: string;
  dateOfBirth?: string;
  createAt?: string;
  status?: string;
  loading: boolean;
};

interface StudentTableProps {
  students: Student[];
  onReload: () => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  pageSize: number;
  totalElements: number;
}


const StudentTable: React.FC<StudentTableProps> = ({ students, onReload, onPageChange, currentPage, pageSize, totalElements }) => {

  const columns: TableColumnsType<Student> = [
    {
      title: 'No',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Student Name',
      dataIndex: 'fullName',
      showSorterTooltip: { target: 'full-header' },
      sorter: (a, b) => (a.fullName?.length ?? 0) - (b.fullName?.length ?? 0),
      sortDirections: ['descend'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      filters: [
        { text: 'Female', value: 'female' },
        { text: 'Male', value: 'male' },

      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      sorter: (a, b) => new Date(a.dateOfBirth ?? '').getTime() - new Date(b.dateOfBirth ?? '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Created At',
      dataIndex: 'createAt',
      sorter: (a, b) => new Date(a.createAt ?? '').getTime() - new Date(b.createAt ?? '').getTime(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'ACTIVE', value: 'ACTIVE' },
        { text: 'PROCESSING', value: 'PROCESSING' },
        { text: 'BANNED', value: 'BANNED' },
        { text: 'UNVERIFIED', value: 'UNVERIFIED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => (

        <Tag color={
          record.status === 'ACTIVE' ? 'green' :
            record.status === 'PROCESSING' ? 'orange' :
              record.status === 'BANNED' ? 'red' :
                record.status === 'UNVERIFIED' ? 'gray' : ''
        }>
          {record.status}
        </Tag>

      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Student) => (
        <>
          <EditStudent record={record} onReload={onReload} />
          <DeleteStudent record={record} onReload={onReload} />
        </>
      )
    }
  ];
  return (
    <div>
      <Table
        rowKey={'id'}
        columns={columns}
        dataSource={students}
        scroll={{ x: true }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: onPageChange,
          showSizeChanger: false,
          total: totalElements,
        }}
      />
    </div>
  );
}

export default StudentTable;
