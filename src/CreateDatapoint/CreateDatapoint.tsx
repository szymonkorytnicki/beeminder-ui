import { useState } from 'react'
import { useMutation } from 'react-query'

export function CreateDatapoint({ onCreate, goalSlug }) {
    const [comment, setComment] = useState('')
    const [value, setValue] = useState(1)
    
    function reset() {
        setValue(1)
        setComment('')
    }

    const { mutate, isLoading } = useMutation(({ value, comment }: {value: number, comment: string}) =>
        fetch(
            `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${goalSlug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&value=${value}&comment=${comment}`,
            {
                method: 'POST',
            }
        ))

    // TODO support for custom step
    return (
        <div>
            {value}
            <input
                type="range"
                id="points"
                min="0"
                max="10"
                name="value"
                value={value}
                disabled={isLoading}
                onChange={(event) =>
                    setValue(event.currentTarget.valueAsNumber)
                }
            />
            <input
                type="text"
                name="comment"
                value={comment}
                disabled={isLoading}
                onChange={(event) => setComment(event.currentTarget.value)}
            />
            <button
                className="button"
                disabled={isLoading}
                onClick={() => {
                    mutate(
                        { value, comment },
                        {
                            onSettled: () => {
                                reset()
                                onCreate()
                            },
                        }
                    )
                }}
            >
                Submit
            </button>
        </div>
    )
}
