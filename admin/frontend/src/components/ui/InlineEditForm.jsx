import {TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";

const InlineEditForm = ({ editHandler, value }) => {
    const form = useForm({
        initialValues: {
            input: value
        },

        validate: {
            input: (value) => (value.length < 2 ? 'Field is required' : null),
        },
    });
    const handlerSubmit = (values) => {
        if(form.isDirty('input')){
            editHandler(values);
            console.log(values)

        }
        // document.activeElement.blur();
    };
    const handlerOnBlur = (values) => {
        if(form.isDirty('input')){
            editHandler(values);
        }
    };

    return (
        <>
            <form onSubmit={form.onSubmit((values) => {
                handlerSubmit(values)
            })} >
                <TextInput
                    placeholder="Enter value here"
                    radius="md"
                    size="md"
                    styles={{
                        borderColor: "gray.3",
                        backgroundColor: "white",
                        focus: {
                            borderColor: "blue.5",
                        },
                    }}
                    {...form.getInputProps('input')}
                    onBlur={(event) => {
                        form.getInputProps('input').onBlur(event);
                        handlerOnBlur(form.values)
                    }}
                />
            </form>
        </>
    )
}

export default InlineEditForm