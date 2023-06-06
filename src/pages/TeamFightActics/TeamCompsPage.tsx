import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { EditableTable } from '@app/components/tables/editableTable/EditableTable';
import * as S from '@app/components/tables/Tables/Tables.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { DocumentData } from 'firebase/firestore';
import teamcompsService from '@app/services/teamcompsService';
import { notificationController } from '@app/controllers/notificationController';
import { getTeamCompsData } from '@app/store/slices/teamCompsSlice';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
  },
  {
    title: 'Carousel',
    dataIndex: 'carousel',
    editable: true,
  },
  {
    title: 'Eary Comp',
    dataIndex: 'early_comp',
    editable: true,
  },
  {
    title: 'Members',
    dataIndex: 'members',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return (
        <ul style={{ listStyle: 'none' }}>
          {record.members.map((r: { name: any; items: any; position: any }) => (
            <li key={r.name}>{`${r.name}-${r.items}-${r.position}`}</li>
          ))}
        </ul>
      );
    },
  },
  {
    title: 'Options',
    dataIndex: 'options',
    editable: true,
    render: (_: string, record: DocumentData) => {
      return (
        <ul style={{ listStyle: 'none' }}>
          {record.options.map((r: { replace_from: any[]; replace_to: any[] }, index: number) => (
            <li key={`key_${index}`}>{`from: ${r.replace_from.join(',')}-to: ${r.replace_to.join(',')}`}</li>
          ))}
        </ul>
      );
    },
  },
];

const TeamCompsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const teamcompsData = useAppSelector((state) => state.teamcomps.data);
  const isLoading = useAppSelector((state) => state.teamcomps.isLoadingTeamComps);

  const handleEdit = async (data) => {
    console.log(data);
    const prepareData = data;
    try {
      await teamcompsService.updateItem(prepareData);
      notificationController.success({
        message: 'Updated teamcomps',
        description: 'Update teamcomps success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't update teamcomps: " + error,
        description: 'Update teamcomps failed',
      });
    }
    dispatch(getTeamCompsData());
  };

  const deleteSynergy = async (record: { id: string }) => {
    try {
      await teamcompsService.deleteTeamComp(record.id);
      notificationController.success({
        message: 'Deleted teamcomp',
        description: 'Deleted teamcomp success',
      });
    } catch (error) {
      notificationController.error({
        message: "Can't delete teamcomp: " + error,
        description: 'Deleted teamcomp failed',
      });
    }
    await dispatch(getTeamCompsData());
  };

  const title = (
    <>
      <BaseRow justify={'space-between'} align={'middle'}>
        <div>TFT Teamcomps</div>
        <a href="https://tftactics-gg-2.web.app/curd/teamcomps">
          <BaseButton>Add Teamcomps</BaseButton>
        </a>
      </BaseRow>
    </>
  );

  return (
    <>
      <PageTitle>TFT Teamcomps</PageTitle>
      <S.Card id="editable-table" title={title} padding="1.25rem 1.25rem 0">
        <EditableTable
          handleDeleteRow={deleteSynergy}
          onSubmitEdit={handleEdit}
          lists={teamcompsData}
          isLoading={isLoading}
          columns={columns}
        />
      </S.Card>
    </>
  );
};

export default TeamCompsPage;
