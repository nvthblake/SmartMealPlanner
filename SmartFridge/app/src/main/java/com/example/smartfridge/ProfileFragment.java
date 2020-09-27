package com.example.smartfridge;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.io.IOException;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ProfileFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfileFragment extends Fragment {

    // variable declarations
    private CircleImageView ProfileImage;
    private static final int PICK_IMAGE = 1;
    Uri imageUri;
    private ProgressBar pgsBar;
    private TextView txtView;
    int status;
    String text;

    SQLiteDatabase sqLiteDatabase;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public ProfileFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment SpiceFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static ProfileFragment newInstance(String param1, String param2) {
        ProfileFragment fragment = new ProfileFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }
    // functions declarations
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        sqLiteDatabase = sqLiteDatabase.openDatabase("/data/data/com.example.smartfridge/databases/smartfridge", null, 0);

        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        // Access gallery

        TextView exp3DTextView = (TextView) view.findViewById(R.id.exp3DTextView);
        TextView exp10DTextView = (TextView) view.findViewById(R.id.exp10DTextView);
        TextView expNegDTextView = (TextView) view.findViewById(R.id.expNegDTextView);


        String sql3D = "SELECT TimeDelta FROM ItemsExpDays WHERE TimeDelta <= 4";
        Cursor mCursor3d = sqLiteDatabase.rawQuery(sql3D, null);
        exp3DTextView.setText(Integer.toString(mCursor3d.getCount()));
        mCursor3d.close();

        String sql10D = "SELECT TimeDelta FROM ItemsExpDays WHERE TimeDelta <= 11";
        Cursor mCursor10d = sqLiteDatabase.rawQuery(sql10D, null);
        exp10DTextView.setText(Integer.toString(mCursor10d.getCount()));
        mCursor10d.close();

        String sqlNegD = "SELECT TimeDelta FROM ItemsExpDays WHERE TimeDelta <= 1";
        Cursor mCursorNegD = sqLiteDatabase.rawQuery(sqlNegD, null);
        expNegDTextView.setText(Integer.toString(mCursorNegD.getCount()));
        mCursorNegD.close();


        ProfileImage = (CircleImageView) view.findViewById(R.id.profile_image);
        ProfileImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent gallery = new Intent();
                gallery.setType("image/*");
                gallery.setAction(Intent.ACTION_GET_CONTENT);

                startActivityForResult(Intent.createChooser(gallery, "Selected Picture"), PICK_IMAGE);
            }
        });

        // Update Fridge status
        pgsBar = (ProgressBar) view.findViewById(R.id.pBar);
        txtView = (TextView) view.findViewById(R.id.tView);
        String sqlItems = "SELECT * FROM ItemsExpDays";
        Cursor cItems = sqLiteDatabase.rawQuery(sqlItems, null);
        status = cItems.getCount();
        cItems.close();
        pgsBar.setProgress(status);
        text = "Your fridge is " + Integer.toString(status) + "% full";
        txtView.setText(text);
        return view;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE) {
            imageUri = data.getData();

            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getActivity().getApplicationContext().getContentResolver(), imageUri);
                ProfileImage.setImageBitmap(bitmap);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}