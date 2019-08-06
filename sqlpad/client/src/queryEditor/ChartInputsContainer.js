import React from 'react';
import { connect } from 'unistore/react';
import {
  handleChartConfigurationFieldsChange,
  handleChartTypeChange
} from '../stores/queries';
import ChartInputs from './ChartInputs.js';

function mapStateToProps(state) {
  return {
    queryResult: state.queryResult,
    chartType:
      state.query &&
      state.query.chartConfiguration &&
      state.query.chartConfiguration.chartType,
    fields:
      state.query &&
      state.query.chartConfiguration &&
      state.query.chartConfiguration.fields
  };
}

const Connected = connect(
  mapStateToProps,
  { handleChartConfigurationFieldsChange, handleChartTypeChange }
)(React.memo(ChartInputsContainer));

function ChartInputsContainer({
  chartType,
  fields,
  queryResult,
  handleChartConfigurationFieldsChange
}) {
  return (
    <ChartInputs
      chartType={chartType}
      queryChartConfigurationFields={fields}
      onChartConfigurationFieldsChange={handleChartConfigurationFieldsChange}
      queryResult={queryResult}
    />
  );
}

export default Connected;
