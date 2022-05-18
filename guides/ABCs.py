import abc


class AbstractMethods(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def abstract_method(self):
        print("Parent Class")


class SecondClass(AbstractMethods):
    def __init__(self):
        print("new Class")

    def abstract_method(self):
        super().abstract_method()
        print("Second Class")


class ThirdClass(SecondClass):
    def __init__(self):
        print("Thrid Class")


new = ThirdClass()
new.abstract_method()
