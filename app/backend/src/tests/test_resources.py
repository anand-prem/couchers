import grpc
import pytest
from google.protobuf import empty_pb2

from pb import resources_pb2
from tests.test_fixtures import resources_session, testconfig


@pytest.fixture(autouse=True)
def _(testconfig):
    pass


def test_GetTermsOfService():
    # make sure it works and we get out a bunch of text
    with resources_session() as api:
        res = api.GetTermsOfService(empty_pb2.Empty()).terms_of_service
        assert len(res) > 100
        assert "couchers.org foundation" in res.lower()
