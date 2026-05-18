import L from "leaflet";
import { Hand, Pencil, Trash2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

export interface LatLng {
  lat: number;
  lng: number;
}

const MEDELLIN: LatLng = { lat: 6.2476, lng: -75.5658 };
const MIN_DRAW_POINTS = 8;

type MapTool = "pan" | "draw";

function simplifyPath(points: LatLng[], step = 3): LatLng[] {
  if (points.length <= MIN_DRAW_POINTS) return points;
  return points.filter((_, i) => i % step === 0 || i === points.length - 1);
}

function MapToolController({
  tool,
  onStrokeComplete,
  onDraftChange,
}: {
  tool: MapTool;
  onStrokeComplete: (polygon: LatLng[]) => void;
  onDraftChange: Dispatch<SetStateAction<LatLng[]>>;
}) {
  const map = useMap();
  const drawingRef = useRef(false);

  useEffect(() => {
    const container = map.getContainer();
    if (tool === "draw") {
      container.style.cursor = "crosshair";
      map.dragging.disable();
      map.doubleClickZoom.disable();
    } else {
      container.style.cursor = "grab";
      map.dragging.enable();
      map.doubleClickZoom.enable();
    }
    return () => {
      container.style.cursor = "";
      map.dragging.enable();
      map.doubleClickZoom.enable();
    };
  }, [map, tool]);

  useMapEvents({
    mousedown(e) {
      if (tool !== "draw") return;
      drawingRef.current = true;
      onDraftChange([{ lat: e.latlng.lat, lng: e.latlng.lng }]);
    },
    mousemove(e) {
      if (tool !== "draw" || !drawingRef.current) return;
      onDraftChange((prev) => {
        const next = [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }];
        const last = prev[prev.length - 1];
        if (last) {
          const dx = Math.abs(last.lat - e.latlng.lat);
          const dy = Math.abs(last.lng - e.latlng.lng);
          if (dx < 0.00008 && dy < 0.00008) return prev;
        }
        return next;
      });
    },
    mouseup() {
      if (tool !== "draw" || !drawingRef.current) return;
      drawingRef.current = false;
      onDraftChange((prev) => {
        if (prev.length >= MIN_DRAW_POINTS) {
          const simplified = simplifyPath(prev);
          onStrokeComplete(simplified);
        }
        return [];
      });
    },
    mouseout() {
      if (tool !== "draw" || !drawingRef.current) return;
      drawingRef.current = false;
      onDraftChange([]);
    },
  });

  return null;
}

interface MapZonePickerProps {
  polygon: LatLng[];
  onPolygonChange: (polygon: LatLng[]) => void;
}

export function MapZonePicker({ polygon, onPolygonChange }: MapZonePickerProps) {
  const [tool, setTool] = useState<MapTool>("pan");
  const [draftStroke, setDraftStroke] = useState<LatLng[]>([]);

  const finishStroke = useCallback(
    (pts: LatLng[]) => {
      if (pts.length >= 3) onPolygonChange(pts);
      setDraftStroke([]);
      setTool("pan");
    },
    [onPolygonChange]
  );

  const clear = () => {
    onPolygonChange([]);
    setDraftStroke([]);
  };

  const positions: [number, number][] = polygon.map(
    (p) => [p.lat, p.lng] as [number, number]
  );
  const draftPositions: [number, number][] = draftStroke.map(
    (p) => [p.lat, p.lng] as [number, number]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Usa la mano para moverte. Pulsa «Dibujar zona» y arrastra en el mapa para
        marcar el área (trazo libre).
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={tool === "pan" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTool("pan");
            setDraftStroke([]);
          }}
        >
          <Hand className="h-4 w-4" />
          Mover mapa
        </Button>
        <Button
          type="button"
          variant={tool === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => setTool("draw")}
        >
          <Pencil className="h-4 w-4" />
          Dibujar zona
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Limpiar
          {polygon.length > 0 ? ` (${polygon.length} pts)` : ""}
        </Button>
      </div>
      <div
        className={`h-[380px] overflow-hidden rounded-lg border border-[var(--color-border)] ${
          tool === "draw" ? "ring-2 ring-[var(--color-primary)]/40" : ""
        }`}
      >
        <MapContainer
          center={[MEDELLIN.lat, MEDELLIN.lng]}
          zoom={13}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapToolController
            tool={tool}
            onStrokeComplete={finishStroke}
            onDraftChange={setDraftStroke}
          />
          {draftStroke.length >= 2 && (
            <Polyline
              positions={draftPositions}
              pathOptions={{ color: "#e03131", weight: 2, dashArray: "4 4" }}
            />
          )}
          {polygon.length >= 2 && (
            <Polygon
              positions={positions}
              pathOptions={{ color: "#3b5bdb", fillOpacity: 0.2 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

void L;
