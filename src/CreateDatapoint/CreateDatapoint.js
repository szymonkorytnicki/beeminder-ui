import { useState } from 'react'
import { useMutation } from 'react-query'

export function CreateDatapoint({ onCreate, goalSlug }) {
    const [comment, setComment] = useState('')
    const [value, setValue] = useState(1)

    const { mutate, isLoading } = useMutation(({ value, comment }) =>
        fetch(
            `https://www.beeminder.com/api/v1/users/${process.env.REACT_APP_BEEMINDER_USERNAME}/goals/${goalSlug}/datapoints.json?auth_token=${process.env.REACT_APP_BEEMINDER_APIKEY}&value=${value}&comment=${comment}`,
            {
                method: 'POST',
            }
        )
    )

    // TODO support for custom step
    return (
        <div>
            <input
                type="number"
                min={1}
                step={1}
                name="value"
                value={value}
                onChange={(event) =>
                    setValue(event.currentTarget.valueAsNumber)
                }
            />
            <input
                type="text"
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.currentTarget.value)}
            />
            <button
                disabled={isLoading}
                onClick={() => {
                    mutate(
                        { value, comment },
                        {
                            onSettled: () => onCreate(),
                        }
                    )
                }}
            >
                Submit
            </button>
        </div>
    )
}
