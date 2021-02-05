import React, { useEffect, useState } from 'react'
import { Container, Flex, FormErrorMessage, Heading, VStack } from '@chakra-ui/react'
import Input from '../components/Input'
import Slider from '../components/Slider'
import LineChart from '../components/LineChart/LineChart'
import DefaultLayout from '../components/layouts/Default'
import fetch from 'node-fetch'

// Note: This is just for example purposes
// should be replaced with real data from the server
const Savings = () => {
    const [data, setData] = useState({
        xAxis: [0, 1, 2, 3, 4, 5],
        yAxis: [100, 150, 180, 210, 240, 350],
    })
    const [formInput, setFormInput] = useState({
        initialSavings: 5000,
        monthlyDeposit: 100,
        interestRate: 0.1,
    })
    useEffect(() => {
        fetch('http://localhost:3001/', {
            method: 'post',
            body: JSON.stringify(formInput),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(async (res) => {
                let { data } = await res.json()
                setData({ xAxis: [...Array(data.length).keys()], yAxis: data })
            })
            .catch((e) => console.log(e))
    }, [formInput])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormInput({
            ...formInput,
            [event.target.name]: parseInt(event.target.value) || 0,
        })
    }
    return (
        <DefaultLayout>
            <Flex
                flexWrap="wrap"
                flexDir="row"
                justifyContent="space-around"
                alignItems="center"
                width="100%"
                maxW="1400px"
                marginX="auto"
                marginY="auto"
            >
                <VStack spacing={4} mx="30px" my="50px">
                    <Heading as="h1" paddingBottom="20px" color="#094067">
                        Interest Rate Calculator
                    </Heading>
                    <Input
                        label="Initial Savings amount"
                        name="initialSavings"
                        placeholder="5000"
                        value={formInput.initialSavings}
                        onChange={handleChange}
                    />
                    {/* <FormErrorMessage>{errors.initialSavings}</FormErrorMessage> */}
                    <Input
                        label="Monthly Deposit"
                        name="monthlyDeposit"
                        placeholder="100"
                        value={formInput.monthlyDeposit}
                        onChange={handleChange}
                    />
                    {/* <FormErrorMessage>{errors.monthlyDeposit}</FormErrorMessage> */}
                    <Slider
                        value={formInput.interestRate * 100}
                        label={
                            'Monthly Interest Rate    ' + formInput.interestRate.toString() + '%'
                        }
                        name="interestRate"
                        defaultValue={5}
                        min={0}
                        max={100}
                        onChange={(value) => {
                            setFormInput({ ...formInput, interestRate: value / 100 })
                        }}
                    />
                    {/* <FormErrorMessage>{errors.interestRate}</FormErrorMessage> */}
                </VStack>
                <Container w="100%" maxW="900px" mx="20px">
                    <LineChart
                        title="Savings Over time"
                        xAxisData={data.xAxis}
                        yAxisData={data.yAxis}
                        xLabel="Years"
                        yLabel="Amount"
                    />
                </Container>
            </Flex>
        </DefaultLayout>
    )
}

export default Savings
