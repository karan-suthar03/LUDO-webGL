#version 300 es
precision highp float;

out vec4 fragColor;

in float v_type;

void main() {
    vec2 coord = gl_PointCoord - 0.5;
    vec2 absCoord = abs(coord);
    float halfSize = 0.5;
    float cornerRadius = 0.25;
    float thickness = 0.055;

    float dist = length(max(absCoord - vec2(halfSize - cornerRadius), 0.0)) - cornerRadius;

    vec2 fw2 = fwidth(gl_PointCoord);
    float fw = max(length(fw2), 0.001);
    
    float alpha = 1.0 - smoothstep(-fw, fw, dist);
    
    float innerAlpha = 1.0 - smoothstep(-thickness - fw, -thickness + fw, dist);
    
    float finalAlpha = alpha - innerAlpha;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);
    
    if (finalAlpha > 0.0) {
        if (v_type == 0.0) {
            fragColor = vec4(1.0, 0.0, 0.0, finalAlpha);
        } else if (v_type == 2.0) {
            fragColor = vec4(0.0, 1.0, 0.0, finalAlpha);
        } else if (v_type == 3.0) {
            fragColor = vec4(0.0, 0.0, 1.0, finalAlpha);
        } else if (v_type == 4.0) {
            fragColor = vec4(1.0, 1.0, 0.0, finalAlpha);
        }
    } else {
        discard;
    }
}
