#version 300 es
precision highp float;

out vec4 fragColor;

in float v_color;
in float v_type;
in float v_pointSize;
in float v_sizeMultiplier;
in float v_direction;

uniform float u_squareSize;

float sdPentagonPointed(vec2 p) {
    vec2 verts[5] = vec2[5](
        vec2(-0.15, -0.15),
        vec2(0.15, -0.15),
        vec2(0.15, 0.2),
        vec2(0.0, 0.35),
        vec2(-0.15, 0.2)
    );

    float minDist = 1e9;
    float inside = 1.0;

    for (int i = 0; i < 5; i++) {
        vec2 a = verts[i];
        vec2 b = verts[(i + 1) % 5];
        vec2 e = b - a;
        vec2 w = p - a;
        float t = clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
        vec2 proj = a + e * t;

        minDist = min(minDist, length(p - proj));

        float crossZ = e.x * (p.y - a.y) - e.y * (p.x - a.x);
        inside *= step(0.0, crossZ);
    }

    return (inside > 0.5 ? -1.0 : 1.0) * minDist;
}

vec2 rotateToUp(vec2 p, float direction) {
    if (direction < 0.5) {
        return p; // up
    } else if (direction < 1.5) {
        return vec2(-p.y, p.x); // right
    } else if (direction < 2.5) {
        return -p; // down
    }
    return vec2(p.y, -p.x); // left
}

void main() {
    vec2 coord = gl_PointCoord - 0.5;
    vec2 absCoord = abs(coord);
    float halfSize = 0.5;
    float cornerRadius = 0.25;
    float scaleFactor = u_squareSize / v_pointSize;
    float thickness = 0.06 * scaleFactor;
    if (v_sizeMultiplier > 5.0) {
        cornerRadius = 0.16;
    }

    float dist;

    if (v_type == 2.0) { // inside home cells
        dist = length(coord) - halfSize; 
    } else if (v_type == 3.0) { // center-point pentagons
        vec2 oriented = rotateToUp(coord, v_direction);
        float pentagonCornerRadius = 0.1;
        dist = sdPentagonPointed(oriented) - pentagonCornerRadius;
    } else { // regular cells
        dist = length(max(absCoord - vec2(halfSize - cornerRadius), 0.0)) - cornerRadius;
    }

    vec2 fw2 = fwidth(gl_PointCoord);
    float fw = max(length(fw2), 0.001);
    
    float alpha = 1.0 - smoothstep(-fw * 0.5, fw * 0.5, dist);
    
    float innerAlpha = 1.0 - smoothstep(-thickness - fw * 0.5, -thickness + fw * 0.5, dist);
    
    float finalAlpha = alpha - innerAlpha;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);
    
    if (finalAlpha > 0.0) {
        if (v_color == 0.0) {
            fragColor = vec4(0.3, 0.3, 0.3, finalAlpha);      // Gray
        } else if (v_color == 1.0) {
            fragColor = vec4(0.8, 0.0, 0.0, finalAlpha);      // Red
        } else if (v_color == 2.0) {
            fragColor = vec4(0.0, 0.9, 0.2, finalAlpha);      // Green
        } else if (v_color == 3.0) {
            fragColor = vec4(0.2, 0.2, 0.8, finalAlpha);      // Blue
        } else if (v_color == 4.0) {
            fragColor = vec4(1.0, 0.7, 0.0, finalAlpha);      // Yellow
        }
    } else {
        discard;
    }
}
