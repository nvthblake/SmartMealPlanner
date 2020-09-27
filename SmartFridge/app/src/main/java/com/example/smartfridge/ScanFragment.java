package com.example.smartfridge;

import android.Manifest;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.database.sqlite.SQLiteDatabase;
import android.widget.Toast;

import java.util.Calendar;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ScanFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ScanFragment extends Fragment {

    private ImageButton imgCapture;
    private Button btnSave;
    private static final int Image_Capture_Code = 1;
    Spinner staticSpinner;
    Spinner staticSpinner2;
    EditText date;
    String expStr;
    String expDate;
    String expMonth;
    String expYear;
    EditText ingredientName;
    String ingredientNameStr;
    EditText quantity;
    String quantityStr;
    String unitStr;
    String categoryStr;
    SQLiteDatabase sqLiteDatabase;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    Bitmap bp;
    byte[] ba;

    public ScanFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ScanFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ScanFragment newInstance(String param1, String param2) {
        ScanFragment fragment = new ScanFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        DbBitmapUtility byteArrayConverter = new DbBitmapUtility();
        if (requestCode == Image_Capture_Code) {
            bp = (Bitmap) data.getExtras().get("data");
            imgCapture.setImageBitmap(Bitmap.createScaledBitmap(bp, 700, 900, false));
            ba = byteArrayConverter.getBytes(bp);
        }
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        sqLiteDatabase = sqLiteDatabase.openDatabase("/data/data/com.example.smartfridge/databases/smartfridge", null, 0);

        View view = inflater.inflate(R.layout.fragment_scan, container, false);

        // Capture Image
        imgCapture = (ImageButton) view.findViewById(R.id.imageCapture);
        imgCapture.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent cInt = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(cInt,Image_Capture_Code);
            }
        });

        ingredientName = (EditText) view.findViewById(R.id.ingredientName);
        quantity = (EditText) view.findViewById(R.id.quantity);

        // Drop-down category
        staticSpinner = (Spinner) view.findViewById(R.id.unit);
        ArrayAdapter<CharSequence> staticAdapter = ArrayAdapter
                .createFromResource(this.getContext(), R.array.unit_array, android.R.layout.simple_spinner_item);
        staticAdapter
                .setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        staticSpinner.setAdapter(staticAdapter);

        // Drop-down category
        staticSpinner2 = (Spinner) view.findViewById(R.id.category);
        ArrayAdapter<CharSequence> staticAdapter2 = ArrayAdapter
                .createFromResource(this.getContext(), R.array.category_array, android.R.layout.simple_spinner_item);
        staticAdapter2
                .setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        staticSpinner2.setAdapter(staticAdapter2);

        // EditText in date format
        date = (EditText) view.findViewById(R.id.expDate);
        date.addTextChangedListener(new TextWatcher() {
            private String current = "";
            private String ddmmyyyy = "DDMMYYYY";
            private Calendar cal = Calendar.getInstance();

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (!s.toString().equals(current)) {
                    String clean = s.toString().replaceAll("[^\\d.]", "");
                    String cleanC = current.replaceAll("[^\\d.]", "");

                    int cl = clean.length();
                    int sel = cl;
                    for (int i = 2; i <= cl && i < 6; i += 2) {
                        sel++;
                    }
                    //Fix for pressing delete next to a forward slash
                    if (clean.equals(cleanC)) sel--;

                    if (clean.length() < 8){
                        clean = clean + ddmmyyyy.substring(clean.length());
                    }else{
                        //This part makes sure that when we finish entering numbers
                        //the date is correct, fixing it otherwise
                        int day  = Integer.parseInt(clean.substring(0,2));
                        int mon  = Integer.parseInt(clean.substring(2,4));
                        int year = Integer.parseInt(clean.substring(4,8));

                        if(mon > 12) mon = 12;
                        cal.set(Calendar.MONTH, mon-1);

                        year = (year<1900)?1900:(year>2100)?2100:year;
                        cal.set(Calendar.YEAR, year);
                        // ^ first set year for the line below to work correctly
                        //with leap years - otherwise, date e.g. 29/02/2012
                        //would be automatically corrected to 28/02/2012

                        day = (day > cal.getActualMaximum(Calendar.DATE))? cal.getActualMaximum(Calendar.DATE):day;
                        clean = String.format("%02d%02d%02d",day, mon, year);
                    }

                    clean = String.format("%s/%s/%s", clean.substring(0, 2),
                            clean.substring(2, 4),
                            clean.substring(4, 8));

                    sel = sel < 0 ? 0 : sel;
                    current = clean;
                    date.setText(current);
                    date.setSelection(sel < current.length() ? sel : current.length());
                    expStr = date.getText().toString();

                }
            }


            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void afterTextChanged(Editable s) {}
        });
        // Save button configuration
        ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},1);
        ActivityCompat.requestPermissions(this.getActivity(), new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},1);

        btnSave = (Button) view.findViewById(R.id.btn_saveItem);
        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                // Save values of input boxes
                ingredientNameStr = ingredientName.getText().toString();
                quantityStr = quantity.getText().toString();
                unitStr = staticSpinner.getSelectedItem().toString();
                categoryStr = staticSpinner2.getSelectedItem().toString();

                // Insert input to database
//                sqLiteDatabase.execSQL("INSERT INTO FactFridge (IngredientName, Amount, Unit, ImageID, InFridge, ExpirationDate, Category) VALUES ('" + ingredientNameStr + "'," + quantityStr + ", '" + unitStr + "', '" + ingredientNameStr + "', 1, '" + expStr + "', '" + categoryStr + "' )");

                ContentValues cv = new ContentValues();
                cv.put("IngredientName", ingredientNameStr);
                cv.put("Amount", quantityStr);
                cv.put("Unit", unitStr);
                cv.put("InFridge", 1);
                cv.put("ExpirationDate", expStr);
                cv.put("Category", categoryStr);
                cv.put("ImageBP", ba);
                sqLiteDatabase.insert("FactFridge", null, cv);

                // Show message and reset input
                Toast.makeText(getActivity(),"Item saved to inventory",Toast.LENGTH_SHORT).show();
//                Log.i("Category ", categoryStr);
                ingredientName.getText().clear();
                quantity.getText().clear();
                date.getText().clear();
                imgCapture.setImageBitmap(null);
                imgCapture.setImageResource(R.drawable.addimage);
                bp.recycle();
                ba = new byte[0];

            }
        });

        return view;
    }
}