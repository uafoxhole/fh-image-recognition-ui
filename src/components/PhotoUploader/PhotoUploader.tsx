import React, { useEffect, useState } from 'react'

import { Button, Image, Group, Text, rem, AspectRatio, ButtonProps, Grid, Container, Center, Flex } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconClipboardCopy } from '@tabler/icons-react';
import { Dropzone, FileWithPath } from '@mantine/dropzone';

import styles from './PhotoUploader.module.css'
import { useImg } from '@/app/context/ImgContext';

interface ICustomDropzone {
    onImageUpload: (image: Blob | null) => void 
}


const CustomDropzone: React.FC<ICustomDropzone> = ({ onImageUpload }) => {

    const [file, setFile] = useState<FileWithPath | null>();

    useEffect(() => {
        if(!file) {
            return;
        }
        
        onImageUpload(file);
        
    }, [file])

  return (
        <Dropzone
            onDrop={(files) => {
                console.log(`Dropped file ${JSON.stringify(files, null, ' ')}`)
                setFile(files[0]); // Only accept the first file.
            }}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={5 * 1024 ** 2}
            accept={["image/png"]}
            className={styles.border__dashed}
            w={'100%'}
        >
        <Container fluid>
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
                <IconUpload
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1.5}
                />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <IconX
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                    stroke={1.5}
                />
            </Dropzone.Reject>
            <Dropzone.Idle>
                <IconPhoto
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                />
            </Dropzone.Idle>

            <div>
            <Text size="xl" inline>
                Drag an image here
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
                or click to select file
            </Text>
            </div>
        </Group>
        </Container>
        </Dropzone>
  );
}

interface IReadClipboardButton extends ButtonProps {
    onImageUpload: (image: Blob | null) => void
}


const ReadClipboardButton: React.FC<IReadClipboardButton> = ({ onImageUpload, ...props}) => {
    const [img, setImg] = React.useState<Blob | null>()

    useEffect(() => {
        if(img) {
            console.log(`Pasted image URL: ${img}`)
            onImageUpload(img)
        }
    }, [img])

    const pasteImg = async () => {
        try {
          const clipboardItems = await navigator.clipboard.read();
    
          for (const item of clipboardItems) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
            //   const blobOutput = await item.getType('image/png');
            //   const imageUrl = URL.createObjectURL(blobOutput);
            //   setImgUrl(imageUrl);

              // Convert the clipboard item to a Blob
        const blobOutput = await item.getType('image/png');
        console.log('Blob details:', {
          type: blobOutput.type,
          size: blobOutput.size,
        });

        // Set the image URL for display
        setImg(blobOutput);

        // Test the blob URL

        return;
            }
          }
    
          alert('No image found in clipboard');
        } catch (e) {
          console.error('Failed to paste image:', e);
        }
    };

    return (
        <>
            <Button {...props} rightSection={<IconClipboardCopy size={14} /> } variant="primary" onClick={pasteImg} >
                Paste
            </Button>
        </>
      )
}

interface IPhotoUploaderProps {
    imageUrl?: string
}

const PhotoUploader: React.FC<IPhotoUploaderProps> = () => {
    const { setImg } = useImg();
    const [image, setImage] = useState<Blob | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    // useEffect(() => {
    //     if (props.imageUrl) {
    //         setImageUrl(props.imageUrl)

    //     }
    // }, [])
    
    const imageUploadHandler = (newImage: Blob | null) => {
        setImage(newImage)
    }

    const resetImageHandler = () => {
        setImage(null)
    }

    useEffect(() => {
        console.log(`Updated imageUrl on parent. Current value: ${image}`)
        setImg(image)

        let imageUrl = null;
        if (image) {
            console.log(`PING PING ${JSON.stringify(image)}`)
            imageUrl = URL.createObjectURL(image);
        }

        setImageUrl(imageUrl)

    }, [image])

    return (
        <>
            <Grid>
                    <Grid.Col span={12}>
                        <Grid>
                            <Grid.Col span={6} >
                                <h3>Image preview</h3>
                            </Grid.Col>
                            <Grid.Col span={6} >

                                    <Center h={'100%'}>
                                        <Flex w={'100%'} justify={'flex-end'} gap={'1em'}>
                                            <ReadClipboardButton onImageUpload={imageUploadHandler}  />
                                            <Button variant='outline' onClick={resetImageHandler}>Reset</Button>
                                        </Flex>

                                    </Center>

                            </Grid.Col>
                        </Grid>
                        
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Container fluid >
                            <AspectRatio ratio={16 / 9} maw={800} mih={400}>
                            <Flex justify={'center'} align={'center'}>
                            { !image && <CustomDropzone onImageUpload={imageUploadHandler} /> }
                            { imageUrl !== null && <Image alt={"Preview picture"} src={imageUrl} fit="contain" onLoad={() => URL.revokeObjectURL(imageUrl)} /> }
                            </Flex>

                            </AspectRatio>
                        </Container>
                    </Grid.Col>

                
            </Grid>

        </>
    )
    
}

export default PhotoUploader