'use client'

import { ImgProvider } from "@/app/context/ImgContext";
import ActivityLogPreview from "@/components/ActivityLogPreveiw/ActivityLogPreview";
// import { UserProps } from "@/components/DiscordAutocomplete/DiscordAutocomplete";
import PhotoUploader from "@/components/PhotoUploader/PhotoUploader";
import { Container, Flex, Grid } from "@mantine/core";
// import { useState } from "react";



export default function ActivityLog() {

    // const [discordUser, setDiscordUser] = useState<UserProps | null>(null)

    
    // const handleChildData = (data: UserProps) => {
    //     setDiscordUser(data);
    //     console.log('Data received from child:', data);
    // };

    return (
        <Container size={"xl"} mt={"md"}>
            <Flex direction={"column"}>
                <Grid columns={12}>
                    <h2>Welcome to Activity Log tool.</h2>
                </Grid>
                <ImgProvider >
                    <Grid >
                        <Grid.Col span={6}>
                            <ActivityLogPreview />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <PhotoUploader />
                        </Grid.Col>
                    </Grid>
                </ImgProvider>
                {/* <Grid columns={12}>
                    <Grid.Col span={6}>
                        { !discordUser && <p>Select discord user.</p>}
                        { discordUser && <>
                        <p>Selected user: {discordUser.nickname}</p>
                        <p><i>Username: {discordUser.username}</i></p>
                        </>}
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <DiscordAutocomplete getDiscordUser={handleChildData}/>
                    </Grid.Col>
                </Grid> */}
                
            </Flex>

        </Container>
    )
}
