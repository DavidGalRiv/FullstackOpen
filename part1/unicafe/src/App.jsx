import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticsLine = ({text, value}) => (
  <p>{text}: {value}</p>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = total ? (good - bad) / total : 0
  const positive = total ? (good / total) * 100 : 0

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <StatisticsLine text = "good" value = {good}/> 
      <StatisticsLine text = "neutral" value = {neutral}/> 
      <StatisticsLine text = "bad" value = {bad}/> 
      <StatisticsLine text = "all" value = {total}/> 
      <StatisticsLine text = "average" value = {average}/> 
      <StatisticsLine text = "positive" value = {positive}/> 
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
