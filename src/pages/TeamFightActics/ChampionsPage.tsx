import React, { useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableTable } from '@app/components/tables/editableTable/EditableTable';
import * as S from '@app/components/tables/Tables/Tables.styles';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { DocumentData } from 'firebase/firestore';
import championsService from '@app/services/championsService';
import { notificationController } from '@app/controllers/notificationController';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@app/firebase';
import { getChampionsData } from '@app/store/slices/championsSlice';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const columns = [
  {
    title: 'Name',
    dataIndex: 'champion_name',
    editable: true,
  },
  {
    title: 'Recommend Items',
    dataIndex: 'champion_items',
    editable: true,
  },
  {
    title: 'Origins',
    dataIndex: 'champion_origin',
    editable: true,
  },
  {
    title: 'Classes',
    dataIndex: 'champion_class',
    editable: true,
  },
  {
    title: 'Magic Resistance',
    dataIndex: 'champion_mr',
    editable: true,
  },
  {
    title: 'Skill Image',
    dataIndex: 'skill_img_link',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return <img width={64} height={64} src={record.skill_img_link} alt={record.skill_name} />;
    },
  },
  {
    title: 'Image',
    dataIndex: 'champion_img_link',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return <img width={64} height={64} src={record.champion_img_link} alt={record.name} />;
    },
    height: '50px',
  },

  {
    title: 'Skill Description',
    dataIndex: 'skill_description',
    editable: true,
  },
  {
    title: 'Skill Description Level',
    dataIndex: 'skill_description_level',
    editable: true,
  },
  {
    title: 'Skill_Name',
    dataIndex: 'skill_name',
    editable: true,
  },
  {
    title: 'Skill_Type',
    dataIndex: 'skill_type',
    editable: true,
  },
  {
    title: 'Attack Speed',
    dataIndex: 'champion_akt_spd',
    editable: true,
  },
  {
    title: 'Armor',
    dataIndex: 'champion_armor',
    editable: true,
  },
  {
    title: 'Crit_Rate',
    dataIndex: 'champion_crit_rate',
    editable: true,
  },
  {
    title: 'Damage',
    dataIndex: 'champion_damage',
    editable: true,
  },
  {
    title: 'Damage_per_second',
    dataIndex: 'champion_dps',
    editable: true,
  },
  {
    title: 'Health',
    dataIndex: 'champion_health',
    editable: true,
  },
  {
    title: 'Mana',
    dataIndex: 'champion_mana',
    editable: true,
  },
  {
    title: 'Range',
    dataIndex: 'champion_range',
    editable: true,
  },
  {
    title: 'Starting Mana',
    dataIndex: 'champion_starting_mana',
    editable: true,
  },
  {
    title: 'isDragon',
    dataIndex: 'is_dragon',
    editable: true,
  },
];

const ChampionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const championsData = useAppSelector((state) => state.champions.data);
  const isLoading = useAppSelector((state) => state.champions.isLoadingChampions);
  const [files, setFiles] = useState<any>();

  const handleEdit = async (data) => {
    console.log(data);
    const prepareData = data;
    if (files?.champion_img_link_file) {
      const metadata = {
        contentType: files?.champion_img_link_file.type,
      };
      const imgRef = ref(storage, `items/${files?.champion_img_link_file.name}`);
      const snapshot = await uploadBytes(imgRef, files?.champion_img_link_file, metadata);
      const imgUrl = await getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      prepareData.champion_img_link = imgUrl;
    }
    if (files?.skill_img_link_file) {
      const metadata = {
        contentType: files?.skill_img_link_file.type,
      };
      const imgRef = ref(storage, `items/${files?.skill_img_link_file.name}`);
      const snapshot = await uploadBytes(imgRef, files?.skill_img_link_file, metadata);
      const imgUrl = await getDownloadURL(ref(storage, snapshot.metadata.fullPath));
      prepareData.skill_img_link = imgUrl;
    }
    try {
      await championsService.updateChampion(prepareData);
      notificationController.success({
        message: 'Updated champion',
        description: 'Update champion success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't update champion: " + error,
        description: 'Update champion failed',
      });
    }
    await dispatch(getChampionsData());
  };

  const getAllFiles = (files: React.SetStateAction<undefined>) => {
    setFiles(files);
  };

  const deleteChampion = async (record: { id: string }) => {
    try {
      await championsService.deleteChampion(record.id);
      notificationController.success({
        message: 'Deleted champion',
        description: 'Deleted champion success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't delete champion: " + error,
        description: 'Deleted champion failed',
      });
    }
    await dispatch(getChampionsData());
  };

  const title = (
    <>
      <BaseRow justify={'space-between'} align={'middle'}>
        <div>TFT Champions</div>
        <a href="https://tftactics-gg-2.web.app/curd/champions">
          <BaseButton>Add Champions</BaseButton>
        </a>
      </BaseRow>
    </>
  );

  return (
    <>
      <PageTitle>TFT Champions</PageTitle>
      <S.Card id="editable-table" title={title} padding="1.25rem 1.25rem 0">
        <EditableTable
          handleDeleteRow={deleteChampion}
          getAllFiles={getAllFiles}
          onSubmitEdit={handleEdit}
          lists={championsData}
          isLoading={isLoading}
          columns={columns}
        />
      </S.Card>
    </>
  );
};

export default ChampionsPage;
