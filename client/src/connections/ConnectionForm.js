import SuccessIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';
import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import HorizontalFormItem from '../common/HorizontalFormItem.js';
import Input from '../common/Input';
import message from '../common/message';
import Select from '../common/Select';
import fetchJson from '../utilities/fetch-json.js';

const TEXT = 'TEXT';
const PASSWORD = 'PASSWORD';
const CHECKBOX = 'CHECKBOX';

function ConnectionForm({ connectionId, onConnectionSaved }) {
  const [connectionEdits, setConnectionEdits] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [testFailed, setTestFailed] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  async function getDrivers() {
    const json = await fetchJson('GET', '/api/drivers');
    if (json.error) {
      message.error(json.error);
    } else {
      setDrivers(json.drivers);
    }
  }

  useEffect(() => {
    getDrivers();
  }, []);

  async function getConnection(connectionId) {
    if (connectionId) {
      const json = await fetchJson('GET', `/api/connections/${connectionId}`);
      if (json.error) {
        message.error(json.error);
      } else {
        setConnectionEdits(json.connection);
      }
    }
  }

  useEffect(() => {
    getConnection(connectionId);
  }, [connectionId]);

  const setConnectionValue = (key, value) => {
    setConnectionEdits(prev => ({ ...prev, [key]: value }));
  };

  const testConnection = async () => {
    setTesting(true);
    const json = await fetchJson(
      'POST',
      '/api/test-connection',
      connectionEdits
    );
    setTesting(false);
    setTestFailed(json.error ? true : false);
    setTestSuccess(json.error ? false : true);
  };

  const saveConnection = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    let json;
    if (connectionEdits._id) {
      json = await fetchJson(
        'PUT',
        '/api/connections/' + connectionEdits._id,
        connectionEdits
      );
    } else {
      json = await fetchJson('POST', '/api/connections', connectionEdits);
    }

    if (json.error) {
      setSaving(false);
      return message.error(json.error);
    }
    return onConnectionSaved(json.connection);
  };

  const renderDriverFields = () => {
    if (connectionEdits.driver && drivers.length) {
      // NOTE connection.driver is driverId
      const driver = drivers.find(
        driver => driver.id === connectionEdits.driver
      );

      if (!driver) {
        console.error(`Driver ${connectionEdits.driver} not found`);
        return null;
      }

      const { fields } = driver;
      return fields.map(field => {
        if (field.formType === TEXT) {
          const value = connectionEdits[field.key] || '';
          return (
            <HorizontalFormItem key={field.key} label={field.label}>
              <Input
                name={field.key}
                value={value}
                onChange={e =>
                  setConnectionValue(e.target.name, e.target.value)
                }
              />
            </HorizontalFormItem>
          );
        } else if (field.formType === PASSWORD) {
          const value = connectionEdits[field.key] || '';
          // autoComplete='new-password' used to prevent browsers from autofilling username and password
          // Because we dont return a password, Chrome goes ahead and autofills
          return (
            <HorizontalFormItem key={field.key} label={field.label}>
              <Input
                type="password"
                autoComplete="new-password"
                name={field.key}
                value={value}
                onChange={e =>
                  setConnectionValue(e.target.name, e.target.value)
                }
              />
            </HorizontalFormItem>
          );
        } else if (field.formType === CHECKBOX) {
          const checked = connectionEdits[field.key] || false;
          return (
            <HorizontalFormItem key={field.key}>
              <input
                type="checkbox"
                checked={checked}
                id={field.key}
                name={field.key}
                onChange={e =>
                  setConnectionValue(e.target.name, e.target.checked)
                }
              />
              <label for={field.key} style={{ marginLeft: 8 }}>
                {field.label}
              </label>
            </HorizontalFormItem>
          );
        }
        return null;
      });
    }
  };

  const { name = '', driver = '' } = connectionEdits;

  const driverSelectOptions = [<option key="none" value="" />];

  if (!drivers.length) {
    driverSelectOptions.push(
      <option key="loading" value="">
        Loading...
      </option>
    );
  } else {
    drivers
      .sort((a, b) => a.name > b.name)
      .forEach(driver =>
        driverSelectOptions.push(
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        )
      );
  }

  return (
    <div style={{ height: '100%' }}>
      <form
        autoComplete="off"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div style={{ overflowY: 'auto', flexGrow: 1, height: '100%' }}>
          <HorizontalFormItem label="Connection name">
            <Input
              name="name"
              value={name}
              error={!name}
              onChange={e => setConnectionValue(e.target.name, e.target.value)}
            />
          </HorizontalFormItem>
          <HorizontalFormItem label="Driver">
            <Select
              name="driver"
              value={driver}
              error={!driver}
              onChange={event =>
                setConnectionValue('driver', event.target.value)
              }
            >
              {driverSelectOptions}
            </Select>
          </HorizontalFormItem>

          {renderDriverFields()}
        </div>
        <div
          style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: '22px',
            textAlign: 'right'
          }}
        >
          <Button
            style={{ width: 120 }}
            type="primary"
            onClick={saveConnection}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>{' '}
          <Button
            style={{ width: 120 }}
            onClick={testConnection}
            disabled={testing}
          >
            {testing ? 'Testing...' : 'Test'}
            {!testing && testSuccess && (
              <SuccessIcon
                style={{
                  marginLeft: 8,
                  height: 18,
                  width: 18,
                  marginBottom: -4
                }}
                color="#52c41a"
              />
            )}
            {!testing && testFailed && (
              <CloseCircleOutlineIcon
                style={{
                  marginLeft: 8,
                  height: 18,
                  width: 18,
                  marginBottom: -4
                }}
                color="#eb2f96"
              />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConnectionForm;
