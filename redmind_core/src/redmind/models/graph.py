from typing import List, Dict, Any
from pydantic import BaseModel
from enum import Enum

class RelationshipType(str, Enum):
    HOSTED_ON = "HOSTED_ON"
    USES = "USES"
    DEPENDS_ON = "DEPENDS_ON"
    CONNECTS_TO = "CONNECTS_TO"
    AUTHENTICATES_WITH = "AUTHENTICATES_WITH"
    REFERENCES = "REFERENCES"
    ROUTES_TO = "ROUTES_TO"
    STORES_DATA_IN = "STORES_DATA_IN"
    # Agent 2 specific relationships
    EXPOSES = "EXPOSES"
    BELONGS_TO = "BELONGS_TO"
    FOUND_IN = "FOUND_IN"
    ASSOCIATED_WITH = "ASSOCIATED_WITH"

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any]

class GraphEdge(BaseModel):
    source: str
    target: str
    label: RelationshipType

class GraphData(BaseModel):
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []

class Relationship(BaseModel):
    source_id: str
    target_id: str
    relationship_type: RelationshipType
