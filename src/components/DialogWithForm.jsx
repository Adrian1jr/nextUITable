import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import AddItemsForm from "./Forms/AddItemsForm";
import { useForm } from "react-hook-form";

export default function DialogWithForm({
  isOpen,
  onClose,
  title,
  actionButtonText,
  onAction,
  form,
  size = "2xl",
}) {
  const { register, handleSubmit } = useForm();
  const { onOpen, onOpenChange } = useDisclosure();
  const [tablesDataFromForm, setTablesDataFromForm] = useState({});

  const motionProps = {
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: "easeIn",
        },
      },
    },
  };

  useEffect(() => {
    if (isOpen) {
      onOpen();
    }
  }, [isOpen]);

  const handleAction = (data) => {
    onAction({
      formValues: { ...data },
      ...tablesDataFromForm,
    });
  };

  const handleGetTablesData = (data) => {
    setTablesDataFromForm((prevData) => {
      return {
        ...prevData,
        ...data,
      };
    });
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
    onClose();
  }, [onClose, onOpenChange]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      placement="center"
      size={size}
      scrollBehavior="inside"
      isDismissable={false}
      classNames={{
        closeButton: "mt-3 mr-3",
      }}
      motionProps={motionProps}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {
                {
                  addItems: (
                    <AddItemsForm
                      register={register}
                      onFormSubmit={handleGetTablesData}
                    />
                  ),
                }[form]
              }
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={handleClose}>
                Close
              </Button>
              <Button
                type="submit"
                value="Submit"
                color="primary"
                onPress={handleSubmit((data) => handleAction(data))}
              >
                {actionButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
