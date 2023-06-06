import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BasicTableRow, Pagination } from 'api/table.api';
import { EditableCell } from './EditableCell';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { DocumentData } from 'firebase/firestore';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 6,
};

interface propsType {
  lists: DocumentData[];
  isLoading: boolean;
  columns: {
    title: string;
    dataIndex: string;
    editable: boolean;
    render?: (_: string, record: DocumentData) => JSX.Element;
    width?: string;
  }[];
  onSubmitEdit?: (data) => void;
  getAllFiles?: (allFile) => void;
  handleDeleteRow?: (record) => void;
}

export const EditableTable: React.FC<propsType> = (props: propsType) => {
  const itemsData = props.lists;
  const isLoading = props.isLoading;
  const [form] = BaseForm.useForm();
  const [tableData, setTableData] = useState<{ data: DocumentData[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const [editingKey, setEditingKey] = useState(0);
  const { t } = useTranslation();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData({
        data: itemsData.map((item: DocumentData, index) => {
          return {
            ...item,
            key: index + 1,
          };
        }),
        pagination: { ...pagination, total: itemsData.length },
        loading: isLoading,
      });
    },
    [itemsData, isLoading],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
    cancel();
  };

  const isEditing = (record: BasicTableRow) => record.key === editingKey;

  const edit = (record: Partial<BasicTableRow> & { key: React.Key }) => {
    form.setFieldsValue({ is_trait: null, trait_name: null, ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (record) => {
    const row = (await form.validateFields()) as BasicTableRow;
    const data = {
      ...row,
      id: record.id,
    };
    if (props.onSubmitEdit) {
      props.onSubmitEdit(data);
    }
    setEditingKey(0);
  };

  const deleteItem = (record) => {
    if (props.handleDeleteRow) {
      props.handleDeleteRow(record);
    }
  };

  const columns = [
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      render: (text: string, record: BasicTableRow) => {
        const editable = isEditing(record);
        return (
          <BaseSpace>
            {editable ? (
              <BaseSpace direction="vertical" align="center">
                <BaseButton size="small" type="primary" onClick={() => save(record)}>
                  {t('common.save')}
                </BaseButton>
                <BasePopconfirm title={t('tables.cancelInfo')} onConfirm={cancel}>
                  <BaseButton size="small" type="ghost">
                    {t('common.cancel')}
                  </BaseButton>
                </BasePopconfirm>
              </BaseSpace>
            ) : (
              <BaseSpace direction="vertical" align="center">
                <BaseButton size="small" type="primary" disabled={editingKey !== 0} onClick={() => edit(record)}>
                  {t('common.edit')}
                </BaseButton>
                <BasePopconfirm title={'Sure to delete'} onConfirm={() => deleteItem(record)}>
                  <BaseButton size="small" type="default" danger>
                    {t('tables.delete')}
                  </BaseButton>
                </BasePopconfirm>
              </BaseSpace>
            )}
          </BaseSpace>
        );
      },
    },
    ...props.columns,
  ];

  const [allFiles, setAllFiles] = useState(Object);

  const fileFromCell = (fileName, file: File) => {
    setAllFiles({
      ...allFiles,
      [fileName]: file,
    });
  };

  useEffect(() => {
    if (props.getAllFiles) {
      props.getAllFiles(allFiles);
    }
  }, [allFiles]);

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: BasicTableRow) => {
        return {
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          fileUpload: fileFromCell,
        };
      },
    };
  });

  return (
    <BaseForm form={form} component={false}>
      <BaseTable
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={tableData.data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          ...tableData.pagination,
          onChange: cancel,
        }}
        onChange={handleTableChange}
        loading={tableData.loading}
        scroll={{ x: 800 }}
      />
    </BaseForm>
  );
};
