import React, { useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableTable } from '@app/components/tables/editableTable/EditableTable';
import * as S from '@app/components/tables/Tables/Tables.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DocumentData } from 'firebase/firestore';
import synergysService from '@app/services/synergysService';
import { notificationController } from '@app/controllers/notificationController';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { getSynergysData } from '@app/store/slices/synergysSlice';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@app/firebase';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const columns = [
  {
    title: 'Name',
    dataIndex: 'synergy_name',
    editable: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    editable: true,
  },
  {
    title: 'Image',
    dataIndex: 'synergy_image',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return (
        <img
          style={{ backgroundColor: 'rgb(1, 80, 154)' }}
          width={64}
          height={64}
          src={record.synergy_image}
          alt={record.synergy_name}
        />
      );
    },
  },
  {
    title: 'Description Level',
    dataIndex: 'synergy_description_level',
    editable: true,
  },
  {
    title: 'Description',
    dataIndex: 'synergy_description',
    editable: true,
  },
];

const SynergysPage: React.FC = () => {
  const [files, setFiles] = useState<any>();
  const dispatch = useAppDispatch();
  const synergysData = useAppSelector((state) => state.synergys.data);
  const isLoading = useAppSelector((state) => state.synergys.isLoadingSynergys);

  const handleEdit = async (data) => {
    const prepareData = data;
    if (files?.synergy_image_file) {
      const metadata = {
        contentType: files?.synergy_image_file.type,
      };
      const imgRef = ref(storage, `items/${files?.synergy_image_file.name}`);
      const snapshot = await uploadBytes(imgRef, files?.synergy_image_file, metadata);
      const imgUrl = await getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      prepareData.synergy_image = imgUrl;
    }
    try {
      await synergysService.updateSynergy(prepareData);
      notificationController.success({
        message: 'Updated synergy',
        description: 'Update synergy success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't update synergy: " + error,
        description: 'Update synergy failed',
      });
    }
    await dispatch(getSynergysData());
  };

  const getAllFiles = (files: React.SetStateAction<undefined>) => {
    setFiles(files);
  };

  const deleteSynergy = async (record: { id: string }) => {
    try {
      await synergysService.deleteSynergy(record.id);
      notificationController.success({
        message: 'Deleted synergy',
        description: 'Deleted synergy success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't delete synergy: " + error,
        description: 'Deleted synergy failed',
      });
    }
    await dispatch(getSynergysData());
  };

  const title = (
    <>
      <BaseRow justify={'space-between'} align={'middle'}>
        <div>TFT Synergys</div>
        <a href="https://tftactics-gg-2.web.app/curd/origins">
          <BaseButton>Add Synergys</BaseButton>
        </a>
      </BaseRow>
    </>
  );

  return (
    <>
      <PageTitle>TFT Synergys</PageTitle>
      <S.Card id="editable-table" title={title} padding="1.25rem 1.25rem 0">
        <EditableTable
          handleDeleteRow={deleteSynergy}
          getAllFiles={getAllFiles}
          onSubmitEdit={handleEdit}
          lists={synergysData}
          isLoading={isLoading}
          columns={columns}
        />
      </S.Card>
    </>
  );
};

export default SynergysPage;
