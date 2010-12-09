/* Color Conversion Library : v1.1 : 2007/04/18 */
/* http://www.nofunc.com/Color_Conversion_Library/ */

new function(_) {

color={};

/* HEX */

color.HEX=function(o) { o=Math.round(Math.min(Math.max(0,o),255));

    return("0123456789ABCDEF".charAt((o-o%16)/16)+"0123456789ABCDEF".charAt(o%16));
    
};

color.HEX_HSV=function(o) { return(color.RGB_HSV(color.HEX_RGB(o))); };

color.HEX_RGB=function(o) {

    return({'R':parseInt(o.substr(0,2),16), 'G':parseInt(o.substr(2,2),16), 'B':parseInt(o.substr(4,2),16), 'A':1});
    
};

/* RGB */

color.RGB_CMY=function(o) {

    return({'C':1-(o.R/255), 'M':1-(o.G/255), 'Y':1-(o.B/255)});

};

color.RGB_CMYK=function(o) {

    var C=1-(o.R/255),M=1-(o.G/255),Y=1-(o.B/255),K=Math.min(Y,Math.min(M,Math.min(C,1)));

    C=Math.round((C-K)/(1-K)*100); M=Math.round((M-K)/(1-K)*100); Y=Math.round((Y-K)/(1-K)*100); K=Math.round(K*100);

    return({'C':C?C:0, 'M':M?M:0, 'Y':Y?Y:0, 'K':K});

};

color.RGB_HEX=function(o) { var fu=color.HEX; return(fu(o.R)+fu(o.G)+fu(o.B)); };

color.RGB_HSV=function(o) { var M=Math.max(o.R,o.G,o.B), delta=M-Math.min(o.R,o.G,o.B), H, S, V;

    if(M!=0) { S=Math.round(delta/M*100);

        if(o.R==M) H=(o.G-o.B)/delta; else if(o.G==M) H=2+(o.B-o.R)/delta; else if(o.B==M) H=4+(o.R-o.G)/delta;

        var H=Math.min(Math.round(H*60),360); if(H<0) H+=360;

    }

    return({'H':H?H:0, 'S':S?S:0, 'V':Math.round((M/255)*100)});

};

color.RGB_XYZ=function(o) { // Observeo.=2�, Illuminant=D65

    function fu(n) { n=n/255; if(n>0.04045) { n=Math.pow(((n+0.055)/1.055),2.4); } else { n=n/12.92; }; return(n*100); }

    var R=fu(o.R), G=fu(o.G), B=fu(o.B);

    return({'X':zero(R*0.4124+G*0.3576+B*0.1805), 'Y':zero(R*0.2126+G*0.7152+B*0.0722), 'Z':zero(R*0.0193+G*0.1192+B*0.9505)});

};

color.RGB_Lab=function(o) { return(color.XYZ_Lab(color.RGB_XYZ(o))); };

/* HSV */

color.HSV_HEX=function(o) { return(color.RGB_HEX(color.HSV_RGB(o))); };

color.HSV_RGB=function(o) {
    
    var R, G, A, B, C, S=o.S/100, V=o.V/100, H=o.H/360;

    if(S>0) { if(H>=1) H=0;

        H=6*H; F=H-Math.floor(H);
        A=Math.round(255*V*(1-S));
        B=Math.round(255*V*(1-(S*F)));
        C=Math.round(255*V*(1-(S*(1-F))));
        V=Math.round(255*V); 

        switch(Math.floor(H)) {

            case 0: R=V; G=C; B=A; break;
            case 1: R=B; G=V; B=A; break;
            case 2: R=A; G=V; B=C; break;
            case 3: R=A; G=B; B=V; break;
            case 4: R=C; G=A; B=V; break;
            case 5: R=V; G=A; B=B; break;

        }

        return({'R':R?R:0, 'G':G?G:0, 'B':B?B:0, 'A':1});

    }
    else return({'R':(V=Math.round(V*255)), 'G':V, 'B':V, 'A':1});

};

/* CIE-L*ab */

color.Lab_LCH=function(o) { var H=Math.atan2(o.b,o.a);

    if(H>0) { H=(H/Math.PI)*180; } else { H=360-(Math.abs(H)/Math.PI)*180; }
    
    return({'L':o.L, 'C':Math.sqrt(Math.pow(o.a,2)+Math.pow(o.b,2)), 'H':H});

};

/* Yxy */

color.Yxy_XYZ=function(o) {

    return({'X':o.x*(o.Y/o.y), 'Y':o.Y, 'Z':(1-o.x-o.y)*(o.Y/o.y)});

};

/* XYZ */

color.XYZ_Lab=function(o) {

    function fu(n) { if(n>0.008856) { return(Math.pow(n,1/3)); } else { return((7.787*n)+(16/116)); } }

    var X=fu(o.X/lum[0]), Y=fu(o.Y/100), Z=fu(o.Z/lum[1]);

    return({'L':(116*Y)-16, 'a':500*(X-Y), 'b':200*(Y-Z)});

};

color.XYZ_Luv=function(o) { var U=(4*o.X)/(o.X+(15*o.Y)+(3*o.Z)), V=(9*o.Y)/(o.X+(15*o.Y)+(3*o.Z)), Y=o.Y/100;
    
    if(Y>0.008856) { Y=Math.pow(Y,1/3); } else { Y=(7.787*Y)+(16/116); }
    
    var _X=lum[0], _Y=100, _Z=lum[1], _L=(116*Y)-16, _U=(4*_X)/(_X+(15*_Y)+(3*_Z)), _V=(9*_Y)/(_X+(15*_Y)+(3*_Z));

    return({'L':_L, 'u':zero(13*_L*(U-_U)), 'v':zero(13*_L*(V-_V))});

};

color.XYZ_RGB=function(o) {

    function fu(n) { if(n>0.0031308) { n=1.055*(Math.pow(n,1/2.4))-0.055; } else { n=12.92*n; }; n*=255; return(Math.max(0,Math.round(n))); }

    var X=o.X/100, Y=o.Y/100, Z=o.Z/100;
    
    var R=X*3.2406+Y*-1.5372+Z*-0.4986, G=X*-0.9689+Y*1.8758+Z*0.0415, B=X*0.0557+Y*-0.2040+Z*1.0570;

    return({'R':fu(R), 'G':fu(G), 'B':fu(B), 'A':1});

};

color.XYZ_Yxy=function(o) {

    return({'Y':o.Y, 'x':zero(o.X/(o.X+o.Y+o.Z)), 'y':zero(o.Y/(o.X+o.Y+o.Z))});

};


/* LIGHTING */

var illuminant={

    'CIE_1931':{ // 2�

        'A':[109.850, 35.585],  // Incandescent
        'C':[98.074, 118.232], 
        'D50':[96.422, 82.521], 
        'D55':[95.682, 92.149], 
        'D65':[95.047, 108.883], // Daylight
        'D75':[94.972, 122.638], 
        'F2':[99.187, 67.395], // Fluorescent
        'F7':[95.044, 108.755], 
        'F11':[100.966, 64.370]},
    
    'CIE_1964':{ // 10�

        'A':[111.144, 35.200],  // Incandescent
        'C':[97.285, 116.145], 
        'D50':[96.720, 81.427], 
        'D55':[95.799, 90.926], 
        'D65':[94.811, 107.304], // Daylight
        'D75':[94.416, 120.641], 
        'F2':[103.280, 69.026], // Fluorescent
        'F7':[95.792, 107.687], 
        'F11':[103.866, 65.627]}}, lum;

color.illuminant=function(o,v) { lum=illuminant[o][v]; };

color.illuminant('CIE_1931','D65'); // Required for Lab & Luv

};