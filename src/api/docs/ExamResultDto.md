# ExamResultDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**examId** | **number** |  | [optional] [default to undefined]
**examName** | **string** |  | [optional] [default to undefined]
**examDate** | **string** |  | [optional] [default to undefined]
**subjectScores** | [**Array&lt;SubjectScoreDto&gt;**](SubjectScoreDto.md) |  | [optional] [default to undefined]
**totalMarks** | **number** |  | [optional] [default to undefined]
**obtainedMarks** | **number** |  | [optional] [default to undefined]
**percentage** | **number** |  | [optional] [default to undefined]
**grade** | **string** |  | [optional] [default to undefined]
**classRank** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ExamResultDto } from './api';

const instance: ExamResultDto = {
    examId,
    examName,
    examDate,
    subjectScores,
    totalMarks,
    obtainedMarks,
    percentage,
    grade,
    classRank,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
