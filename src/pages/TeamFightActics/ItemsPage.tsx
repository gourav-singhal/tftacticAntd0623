import React, { useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableTable } from '@app/components/tables/editableTable/EditableTable';
import * as S from '@app/components/tables/Tables/Tables.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DocumentData } from 'firebase/firestore';
import itemsService from '@app/services/itemsService';
import { notificationController } from '@app/controllers/notificationController';
import { getItemsData } from '@app/store/slices/itemsSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@app/firebase';
import { OPTIONS_STATS } from '@app/components/tables/editableTable/EditableCell';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const columns = [
  {
    title: 'Name',
    dataIndex: 'item_name',
    editable: true,
  },
  {
    title: 'stats',
    dataIndex: 'item_stats',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return Object.keys(record.item_stats).map((key) => {
        return <p key={key}>{`${key}: ${record.item_stats[key]}`}</p>;
      });
    },
  },
  {
    title: 'image',
    dataIndex: 'item_image',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return <img width={64} height={64} src={record.item_image} alt={record.name} />;
    },
  },
  {
    title: 'recipe1',
    dataIndex: 'recipe_1',
    editable: true,
  },
  {
    title: 'recipe2',
    dataIndex: 'recipe_2',
    editable: true,
  },
  {
    title: 'isAura',
    dataIndex: 'is_aura_item',
    editable: true,
  },
  {
    title: 'isTraitItem',
    dataIndex: 'is_trait',
    editable: true,
  },
  {
    title: 'Trait Name',
    dataIndex: 'trait_name',
    editable: true,
  },
  {
    title: 'isCraftable',
    dataIndex: 'is_combined',
    editable: true,
  },
  {
    title: 'isUnique',
    dataIndex: 'is_unique_item',
    editable: true,
  },
  {
    title: 'description',
    dataIndex: 'item_description',
    editable: true,
  },
];

const ItemsPage: React.FC = () => {
  const [files, setFiles] = useState<any>();
  const dispatch = useAppDispatch();
  const itemsData = useAppSelector((state) => state.items.data);
  const isLoading = useAppSelector((state) => state.items.isLoadingItems);

  const handleEdit = async (data: any) => {
    const prepareData = data;
    prepareData.item_stats = {};
    if (files?.item_image_file) {
      const metadata = {
        contentType: files?.item_image_file.type,
      };
      const imgRef = ref(storage, `items/${files?.item_image_file.name}`);
      const snapshot = await uploadBytes(imgRef, files?.item_image_file, metadata);
      const imgUrl = await getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      prepareData.item_image = imgUrl;
    }
    OPTIONS_STATS.forEach((stats) => {
      if (data[`item_stat_${stats}`] !== undefined) {
        prepareData.item_stats[`item_stat_${stats}`] = data[`item_stat_${stats}`];
        delete prepareData[`item_stat_${stats}`];
      }
    });
    try {
      await itemsService.updateItem(prepareData);
      notificationController.success({
        message: 'Updated Item',
        description: 'Update item success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't update item: " + error,
        description: 'Update item failed',
      });
    }
    await dispatch(getItemsData());
  };

  const getAllFiles = (files: React.SetStateAction<undefined>) => {
    setFiles(files);
  };

  const deleteItem = async (record: { id: string }) => {
    try {
      await itemsService.deleteItem(record.id);
      notificationController.success({
        message: 'Deleted Item',
        description: 'Deleted item success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't delete item: " + error,
        description: 'Deleted item failed',
      });
    }
    await dispatch(getItemsData());
  };

  const title = (
    <>
      <BaseRow justify={'space-between'} align={'middle'}>
        <div>TFT Items</div>
        <a href="https://tftactics-gg-2.web.app/curd/items">
          <BaseButton>Add Items</BaseButton>
        </a>
      </BaseRow>
    </>
  );

  return (
    <>
      <PageTitle>TFT Items</PageTitle>
      <S.Card id="editable-table" title={title} padding="1.25rem 1.25rem 0">
        <EditableTable
          handleDeleteRow={deleteItem}
          getAllFiles={getAllFiles}
          onSubmitEdit={handleEdit}
          lists={itemsData}
          isLoading={isLoading}
          columns={columns}
        />
      </S.Card>
    </>
  );
};

export default ItemsPage;
