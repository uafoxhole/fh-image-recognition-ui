import { Flex, Textarea } from '@mantine/core'
import React,  {useEffect} from 'react'
import { useActivityLogApiWithStatus } from '../UseIRApiWIthStatus/UseIRApiWithStatus'
import { useImg } from '@/app/context/ImgContext'

interface IActivityLogItem {
    text: string,
    value: number
}

const ActivityLogItem = (props: IActivityLogItem) => {


    return (
        <Flex direction={'row'} gap={5} >
            <span>{props.text}: </span>
            <span>{props.value}</span>
        </Flex>
    )
}

// type Props = {}

const ActivityLogPreview = () => {
    const { img } = useImg();

    // const { response, status, fetchData } = useApiWithStatus<any[]>(
    //     'api/health',
    //     'GET'
    //   );


    const { response, status, fetchData } = useActivityLogApiWithStatus(
      );
    
      useEffect(() => {  
        if (img === null) {
            return
        }

        console.log(`FetchingImageData`);
        
        
        fetchData(img);
      }, [img]);


  return (
    <>
        <h3>Extracted data:</h3>
        {!img && <p>No image set</p>}
        {img && <p>Conversion status: {status}</p> }
        {
            img && response && status === 'success' &&
                <>
                    <Flex direction={'column'} ml={'1rem'} mb={'1rem'}>
                        {Object.entries(response?.message.data).map(([key, item]) => (
                            <ActivityLogItem value={item.rowValue} text={item.rowName} key={key} />
                        ))}
                    </Flex>
                    { /* Display value for copying into Google Sheets  */ }
                    <Textarea
                    label={'Paste this string into Google Sheets (excludes Vehicle Self Damage)'}
                    value={
                        Object.entries(response?.message.data)
                            .map(([, item]) => item.rowValue)
                            .filter((_, index) => index <= 8 || index >= 12) // exclude Vehicle Self Damage values
                            .join(',')
                    }
                        />
                </>
        }

    </>
  )
}

export default ActivityLogPreview