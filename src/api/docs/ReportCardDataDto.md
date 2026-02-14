# ReportCardDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**student** | [**StudentProfileDto**](StudentProfileDto.md) |  | [optional] [default to undefined]
**term** | [**TermDetailsDto**](TermDetailsDto.md) |  | [optional] [default to undefined]
**attendance** | [**AttendanceSummaryDto**](AttendanceSummaryDto.md) |  | [optional] [default to undefined]
**academics** | [**Array&lt;SubjectMarkDto&gt;**](SubjectMarkDto.md) |  | [optional] [default to undefined]
**result** | [**ResultSummaryDto**](ResultSummaryDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ReportCardDataDto } from './api';

const instance: ReportCardDataDto = {
    student,
    term,
    attendance,
    academics,
    result,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
