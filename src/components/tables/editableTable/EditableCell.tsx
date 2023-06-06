import React, { useState, useEffect } from 'react';
import { BasicTableRow } from '@app/api/table.api';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { BaseUpload } from '@app/components/common/BaseUpload/BaseUpload';
import { PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'rc-field-form';
import { NumberInput } from '@app/components/header/dropdowns/settingsDropdown/settingsOverlay/nightModeSettings/NightTimeSlider/NightTimeSlider.styles';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'number' | 'text';
  record: BasicTableRow;
  index: number;
  children: React.ReactNode;
  fileUpload?: (fileName: string, file: File) => void;
}

const dataIndexsUseTextarea = [
  'item_description',
  'skill_description_level',
  'synergy_description_level',
  'synergy_description',
  'skill_description',
];

export const OPTIONS_STATS = ['damage', 'health', 'atk_spd', 'mr', 'mana', 'crit', 'armor', 'magic', 'dodge'];

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  fileUpload,
  ...restProps
}) => {
  const beforeUpload = (file: File) => {
    if (fileUpload) {
      fileUpload(`${dataIndex}_file`, file);
    }
  };

  const baseFormItem = (
    element:
      | string
      | number
      | boolean
      | React.ReactFragment
      | ((form: FormInstance<unknown>) => React.ReactNode)
      | JSX.Element
      | null
      | undefined,
    rules = [
      {
        required: true,
        message: `Please Input ${title}!`,
      },
    ],
    label = null,
  ) => {
    return (
      <BaseForm.Item label={label} name={dataIndex} style={{ margin: 0 }} rules={rules}>
        {element}
      </BaseForm.Item>
    );
  };
  let inputNode = inputType === 'number' ? baseFormItem(<InputNumber />) : baseFormItem(<BaseInput />);
  if (dataIndexsUseTextarea.includes(dataIndex)) {
    inputNode = baseFormItem(<BaseInput.TextArea style={{ width: 'unset' }} rows={10} cols={20} />);
  }
  if (dataIndex === 'recipe_1' || dataIndex === 'recipe_2') {
    const itemsData = useAppSelector((state) => state.items.data);
    const options = itemsData
      ?.filter((item) => item.is_combined === 'false')
      .map((item) => {
        return (
          <Option key={item.item_name} value={item.item_name.toLowerCase()}>
            {item.item_name}
          </Option>
        );
      });
    options?.unshift(
      <Option key="None" value={null}>
        None
      </Option>,
    );
    inputNode = baseFormItem(<BaseSelect>{options}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  if (dataIndex === 'item_image') {
    inputNode = (
      <>
        {baseFormItem(<BaseInput style={{ display: 'none' }} />)}
        <img width={130} src={restProps.record.item_image} />
        <BaseForm.Item label="Replace Image to" valuePropName="fileList">
          <BaseUpload beforeUpload={(e) => beforeUpload(e)} action="/upload.do" maxCount={1} listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </BaseUpload>
        </BaseForm.Item>
      </>
    );
  }

  if (dataIndex === 'champion_origin' || dataIndex === 'champion_class') {
    const origins = useAppSelector((state) => state.synergys.data).filter((trait) => {
      if (dataIndex === 'champion_origin') return trait.type === 'origin';
      if (dataIndex === 'champion_class') return trait.type === 'class';
    });
    const options = origins!.map((item) => {
      return (
        <Option key={item.synergy_name} value={item.synergy_name}>
          {item.synergy_name}
        </Option>
      );
    });
    inputNode = baseFormItem(<BaseSelect mode="multiple">{options}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  if (dataIndex === 'champion_items') {
    const items = useAppSelector((state) => state.items.data).filter((item) => item.is_combined === 'true');
    const options = items!.map((item) => {
      return (
        <Option key={item.item_name} value={item.item_name}>
          {item.item_name}
        </Option>
      );
    });
    inputNode = baseFormItem(<BaseSelect mode="multiple">{options}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  if (dataIndex === 'carousel') {
    const items = useAppSelector((state) => state.items.data).filter((item) => item.is_combined === 'false');
    const options = items!.map((item) => {
      return (
        <Option key={item.item_name} value={item.item_name}>
          {item.item_name}
        </Option>
      );
    });
    inputNode = baseFormItem(<BaseSelect mode="multiple">{options}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  if (dataIndex === 'early_comp') {
    const champions = useAppSelector((state) => state.champions.data);
    const options = champions!.map((item) => {
      return (
        <Option key={item.champion_name} value={item.champion_name}>
          {item.champion_name}
        </Option>
      );
    });
    inputNode = baseFormItem(<BaseSelect mode="multiple">{options}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  if (dataIndex === 'synergy_image') {
    inputNode = (
      <>
        {baseFormItem(<BaseInput style={{ display: 'none' }} />)}
        <img style={{ backgroundColor: 'rgb(1, 80, 154)' }} width={130} src={restProps.record.synergy_image} />
        <BaseForm.Item label="Replace Image to" valuePropName="fileList">
          <BaseUpload beforeUpload={(e) => beforeUpload(e)} action="/upload.do" maxCount={1} listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </BaseUpload>
        </BaseForm.Item>
      </>
    );
  }

  if (dataIndex === 'champion_img_link') {
    inputNode = (
      <>
        {baseFormItem(<BaseInput style={{ display: 'none' }} />)}
        <img style={{ backgroundColor: 'rgb(1, 80, 154)' }} width={102} src={restProps.record.champion_img_link} />
        <BaseForm.Item label="Replace Image to" valuePropName="fileList">
          <BaseUpload beforeUpload={(e) => beforeUpload(e)} action="/upload.do" maxCount={1} listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </BaseUpload>
        </BaseForm.Item>
      </>
    );
  }

  if (dataIndex === 'skill_img_link') {
    inputNode = (
      <>
        {baseFormItem(<BaseInput style={{ display: 'none' }} />)}
        <img style={{ backgroundColor: 'rgb(1, 80, 154)' }} width={102} src={restProps.record.skill_img_link} />
        <BaseForm.Item label="Replace Image to" valuePropName="fileList">
          <BaseUpload beforeUpload={(e) => beforeUpload(e)} action="/upload.do" maxCount={1} listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </BaseUpload>
        </BaseForm.Item>
      </>
    );
  }

  if (dataIndex === 'champion_mr') {
    inputNode = baseFormItem(<BaseInput />, [
      {
        required: false,
        message: 'hehe',
      },
    ]);
  }

  if (dataIndex === 'item_stats') {
    const [statsValue, setStatsValue] = useState(restProps.record.item_stats);
    const stats = Object.keys(restProps.record.item_stats).map((item) => item.replace('item_stat_', ''));
    const [selectValue, setselectValue] = useState<any>(stats);

    const hanleStatsChange = (e: React.ChangeEvent<HTMLInputElement>, name: any) => {
      setStatsValue((pre: any) => {
        return {
          ...pre,
          [`item_stat_${name}`]: e.target.value,
        };
      });
    };

    inputNode = (
      <>
        <BaseSelect
          style={{ minWidth: '100px' }}
          placeholder={'Stats'}
          value={selectValue}
          onChange={setselectValue}
          mode="multiple"
          defaultValue={stats}
        >
          {OPTIONS_STATS.map((statName) => {
            return (
              <Option key={statName} value={statName}>
                {statName}
              </Option>
            );
          })}
        </BaseSelect>
        {selectValue.map((item: React.Key | null | undefined) => {
          return (
            <BaseForm.Item
              key={item}
              name={`item_stat_${item}`}
              label={'Item ' + item}
              rules={[
                {
                  required: true,
                  message: 'invalid value',
                },
              ]}
              initialValue={restProps.record.item_stats[`item_stat_${item}`]}
            >
              <BaseInput
                value={statsValue[`item_stat_${item}`]}
                onChange={(e) => hanleStatsChange(e, item)}
                defaultValue={restProps.record.item_stats[`item_stat_${item}`]}
              />
            </BaseForm.Item>
          );
        })}
      </>
    );
  }

  if (dataIndex === 'is_trait')
    inputNode = baseFormItem(<BaseInput />, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);

  if (dataIndex === 'trait_name') {
    const synergysData = useAppSelector((state) => state.synergys.data);
    const synergysOptions = synergysData!.map((item) => {
      return (
        <Option key={item.synergy_name} value={item.synergy_name}>
          {item.synergy_name}
        </Option>
      );
    });
    synergysOptions?.unshift(
      <Option key="None" value={null}>
        None
      </Option>,
    );

    inputNode = baseFormItem(<BaseSelect>{synergysOptions}</BaseSelect>, [
      {
        required: false,
        message: `Please Input ${title}!`,
      },
    ]);
  }

  return <td {...restProps}>{editing ? inputNode : children}</td>;
};
