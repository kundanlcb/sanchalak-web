# ResultsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**studentId** | **number** |  | [optional] [default to undefined]
**studentName** | **string** |  | [optional] [default to undefined]
**className** | **string** |  | [optional] [default to undefined]
**academicYear** | **string** |  | [optional] [default to undefined]
**examResults** | [**Array&lt;ExamResultDto&gt;**](ExamResultDto.md) |  | [optional] [default to undefined]
**overallPerformance** | [**OverallPerformanceDto**](OverallPerformanceDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ResultsDto } from './api';

const instance: ResultsDto = {
    studentId,
    studentName,
    className,
    academicYear,
    examResults,
    overallPerformance,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
